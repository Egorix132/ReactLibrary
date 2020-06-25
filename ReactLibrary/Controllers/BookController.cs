using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactLibrary.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : ControllerBase
    {
        readonly BookContext db;
        public BookController(BookContext context)
        {
            db = context;
            if (!db.Books.Any())
            {
                db.Books.Add(new Book { Name = "Design Patterns", Year = 1994, Genre = "Tech lit", Author = "Gof" });
                db.Books.Add(new Book { Name = "Clever Algorithms", Year = 2011, Genre = "Tech lit", Author = "Jason Brownlee" });
                db.SaveChanges();
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> Get()
        {
            return await db.Books.ToListAsync();
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Book>> Post(Book Book)
        {
            if (Book == null)
            {
                return BadRequest();
            }

            db.Books.Add(Book);
            await db.SaveChangesAsync();
            return Ok(Book);
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult<Book>> Put(Book Book)
        {
            if (Book == null)
            {
                return BadRequest();
            }
            if (!db.Books.Any(x => x.Id == Book.Id))
            {
                return NotFound();
            }

            db.Update(Book);
            await db.SaveChangesAsync();
            return Ok(Book);
        }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult<Book>> Delete(int[] ids)
        {
            List<Book> Books = await db.Books.Where(b => ids.Contains(b.Id)).ToListAsync();
            if (Books.Count <= 0)
            {
                return NotFound();
            }
            db.Books.RemoveRange(Books);
            await db.SaveChangesAsync();
            return Ok(Books);
        }
    }
}
