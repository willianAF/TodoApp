using backend.Models;

namespace backend.Repositories
{
    public interface ITodoRepository
    {
        Task<IEnumerable<Todo>> GetAllAsync(string? searchTerm = null);
        Task<Todo?> GetByIdAsync(int id);
        Task<Todo> CreateAsync(Todo todo);
        Task<bool> UpdateAsync(Todo todo);
        Task<bool> DeleteAsync(Todo todo);
        Task<bool> ExistsAsync(int id);
    }
}