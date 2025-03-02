using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Repository for managing Todo entities in the database
    /// </summary>
    public class TodoRepository : ITodoRepository
    {
        private readonly TodoDbContext _context;

        public TodoRepository(TodoDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Todo>> GetAllAsync(string? searchTerm = null)
        {
            var query = _context.Todos.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(t => 
                    t.Title.ToLower().Contains(searchTerm) || 
                    t.Description.ToLower().Contains(searchTerm)
                );
            }

            return await query
                .OrderBy(t => t.IsCompleted)
                .ThenByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<Todo?> GetByIdAsync(int id)
        {
            return await _context.Todos.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Todo> CreateAsync(Todo todo)
        {
            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();
            return todo;
        }

        public async Task<bool> UpdateAsync(Todo todo)
        {
            if (todo == null)
            {
                throw new ArgumentNullException(nameof(todo));
            }

            try
            {
                _context.Entry(todo).State = EntityState.Modified;
                return (await _context.SaveChangesAsync()) > 0;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ExistsAsync(todo.Id))
                {
                    throw new InvalidOperationException($"Todo with ID {todo.Id} not found");
                }
                throw;
            }
        }

        public async Task<bool> DeleteAsync(Todo todo)
        {
            if (todo == null)
            {
                throw new ArgumentNullException(nameof(todo));
            }

            try
            {
                _context.Todos.Remove(todo);
                return (await _context.SaveChangesAsync()) > 0;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to delete todo with ID {todo.Id}", ex);
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Todos.AnyAsync(t => t.Id == id);
        }
    }
}