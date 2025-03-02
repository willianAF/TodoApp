using backend.Models;

namespace backend.Services
{
    public interface ITodoService
    {
        Task<Result<IEnumerable<Todo>>> GetAllTodosAsync(string? search = null);
        Task<Result<Todo>> GetTodoByIdAsync(int id);
        Task<Result<Todo>> CreateTodoAsync(Todo todo);
        Task<Result> UpdateTodoAsync(int id, Todo todo);
        Task<Result> DeleteTodoAsync(int id);
        Task<Result<Todo>> ToggleTodoStatusAsync(int id);
    }
}