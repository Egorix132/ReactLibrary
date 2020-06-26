using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactLibrary.Models;
using ReactLibrary.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReactLibrary.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        readonly PersonContext db;
        readonly ITokenService tokenService;
        public AuthController(PersonContext context, ITokenService tokenService)
        {
            db = context;
            this.tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(string[] loginAndPassword)
        {
            var identity = await GetIdentity(loginAndPassword[0], loginAndPassword[1]);
            if (identity == null)
            {
                return BadRequest(new { errorText = "Invalid username or password" });
            }

            Person person = await db.Persons.FirstOrDefaultAsync(x => x.Login == loginAndPassword[0] && x.Password == loginAndPassword[1]);

            var encodedJwt = tokenService.CreateJWT(identity);
            var refreshToken = tokenService.CreateRefreshToken();

            person.RefreshToken = refreshToken.Token;
            db.Persons.Update(person);
            await db.SaveChangesAsync();

            var response = new
            {
                access_token = encodedJwt,
                refresh_token = refreshToken,
                username = identity.Name
            };

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(string[] loginAndPassword)
        {
            Person person = await db.Persons.FirstOrDefaultAsync(x => x.Login == loginAndPassword[0]);
            if(person != null)
                return BadRequest(new { errorText = "User already exist" });

            if (loginAndPassword[0].Length <= 2)
                return BadRequest(new { errorText = "Login must be more than two characters" });

            if(loginAndPassword[1].Length <= 6)
                return BadRequest(new { errorText = "Password must be more than six characters" });

            person = new Person
            {
                Login = loginAndPassword[0],
                Password = loginAndPassword[1]
            };
            db.Persons.Add(person);
            await db.SaveChangesAsync();

            ClaimsIdentity identity = await GetIdentity(person.Login, person.Password);

            var encodedJwt = tokenService.CreateJWT(identity);
            var refreshToken = tokenService.CreateRefreshToken();

            person.RefreshToken = refreshToken.Token;
            db.Persons.Update(person);
            await db.SaveChangesAsync();

            var response = new
            {
                access_token = encodedJwt,
                refresh_token = refreshToken,
                username = identity.Name
            };

            return Ok(response);            
        }

        [HttpPost("refresh")]
        public async Task<ActionResult> Refresh(RefreshToken token)
        {
            if (token.IsExpired)
            {
                return BadRequest(new { errorText = "Token is expired" });
            }

            Person person = await db.Persons.FirstOrDefaultAsync(x => x.RefreshToken == token.Token);
            if (person == null)
            {
                return BadRequest(new { errorText = "Incorrect token" });
            }

            ClaimsIdentity identity = await GetIdentity(person.Login, person.Password);

            var encodedJwt = tokenService.CreateJWT(identity);
            var refreshToken = tokenService.CreateRefreshToken();

            person.RefreshToken = refreshToken.Token;
            db.Persons.Update(person);
            await db.SaveChangesAsync();

            var response = new
            {
                access_token = encodedJwt,
                refresh_token = refreshToken,
                username = identity.Name
            };

            return Ok(response);
        }

        private async Task<ClaimsIdentity> GetIdentity(string username, string password)
        {
            Person person = await db.Persons.FirstOrDefaultAsync(x => x.Login == username && x.Password == password);
            if (person != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, person.Login),
                };
                ClaimsIdentity claimsIdentity =
                new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);
                return claimsIdentity;
            }

            return null;
        }
    }
}
