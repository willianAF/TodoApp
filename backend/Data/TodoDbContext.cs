using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options)
            : base(options)
        {
        }

        public DbSet<Todo> Todos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Todo>()
                .Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<Todo>()
                .Property(t => t.Description)
                .HasMaxLength(1000);
        }
    }
}