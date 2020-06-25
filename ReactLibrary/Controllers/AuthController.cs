using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReactLibrary.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReactLibrary.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        readonly PersonContext db;
        public AuthController(PersonContext context)
        {
            db = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(string[] loginAndPassword)
        {
            var identity = await GetIdentity(loginAndPassword[0], loginAndPassword[1]);
            if (identity == null)
            {
                return BadRequest(new { errorText = "Invalid username or password" });
            }

            var encodedJwt = CreateToken(identity);

            var response = new
            {
                access_token = encodedJwt,
                username = identity.Name
            };

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(string[] loginAndPassword)
        {
            Person person = await db.Persons.FirstOrDefaultAsync(x => x.Login == loginAndPassword[0]);
            if(person == null)
                return BadRequest(new { errorText = "User already exist" });

            if (loginAndPassword[0].Length > 2)
                return BadRequest(new { errorText = "Login must be more than two characters" });

            if(loginAndPassword[1].Length > 6)
                return BadRequest(new { errorText = "Password must be more than six characters" });

            person = new Person
            {
                Login = loginAndPassword[0],
                Password = loginAndPassword[1]
            };
            db.Persons.Add(person);
            await db.SaveChangesAsync();

            ClaimsIdentity identity = await GetIdentity(loginAndPassword[0], loginAndPassword[1]);

            var encodedJwt = CreateToken(identity);

            var response = new
            {
                access_token = encodedJwt,
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

        private string CreateToken(ClaimsIdentity identity)
        {
            var now = DateTime.UtcNow;
            var jwt = new JwtSecurityToken(
                    issuer: AuthOptions.ISSUER,
                    audience: AuthOptions.AUDIENCE,
                    notBefore: now,
                    claims: identity.Claims,
                    expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}
