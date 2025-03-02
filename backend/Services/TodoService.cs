using backend.Models;
using backend.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    /// <summary>
    /// Service for managing Todo items
    /// </summary>
    public class TodoService : ITodoService
    {
        private readonly ITodoRepository _todoRepository;

        public TodoService(ITodoRepository todoRepository)
        {
            _todoRepository = todoRepository;
        }

        /// <summary>
        /// Retrieves all todos with optional search filtering
        /// </summary>
        /// <param name="search">Optional search term to filter todos</param>
        /// <returns>A collection of todos matching the search criteria</returns>
        public async Task<Result<IEnumerable<Todo>>> GetAllTodosAsync(string? search = null)
        {
            try
            {
                var todos = await _todoRepository.GetAllAsync(search);
                return Result<IEnumerable<Todo>>.Success(todos);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<Todo>>.Failure("Failed to retrieve todos");
            }
        }

        /// <summary>
        /// Retrieves a specific todo by its ID
        /// </summary>
        /// <param name="id">The ID of the todo to retrieve</param>
        /// <returns>The requested todo or null if not found</returns>
        /// <exception cref="ArgumentException">Thrown when ID is invalid</exception>
        public async Task<Result<Todo>> GetTodoByIdAsync(int id)
        {
            if (id <= 0)
            {
                return Result<Todo>.Failure("Todo ID must be positive");
            }

            try
            {
                var todo = await _todoRepository.GetByIdAsync(id);
                if (todo == null)
                {
                    return Result<Todo>.Failure("Todo not found");
                }
                return Result<Todo>.Success(todo);
            }
            catch (Exception ex)
            {
                return Result<Todo>.Failure($"Failed to retrieve todo with ID {id}");
            }
        }

        /// <summary>
        /// Creates a new todo item
        /// </summary>
        /// <param name="todo">The todo item to create</param>
        /// <returns>The created todo item</returns>
        /// <exception cref="ArgumentException">Thrown when todo is invalid</exception>
        /// <exception cref="InvalidOperationException">Thrown when creation fails</exception>
        public async Task<Result<Todo>> CreateTodoAsync(Todo todo)
        {
            if (todo == null)
            {
                return Result<Todo>.Failure("Todo cannot be null");
            }

            if (string.IsNullOrWhiteSpace(todo.Title))
            {
                return Result<Todo>.Failure("Title is required");
            }

            try
            {
                // Set creation time to current UTC time
                todo.CreatedAt = DateTime.UtcNow;
                todo.IsCompleted = false; // Ensure new todos start as not completed
                todo.CompletedAt = null;
                var createdTodo = await _todoRepository.CreateAsync(todo);
                return Result<Todo>.Success(createdTodo);
            }
            catch (Exception ex)
            {
                return Result<Todo>.Failure("Failed to create todo");
            }
        }

        public async Task<Result> UpdateTodoAsync(int id, Todo todo)
        {
            if (string.IsNullOrWhiteSpace(todo.Title))
            {
                return Result.Failure("Title is required");
            }

            if (id != todo.Id)
            {
                return Result.Failure("Id mismatch");
            }

            try
            {
                var existingTodo = await _todoRepository.GetByIdAsync(id);
                if (existingTodo == null)
                {
                    return Result.Failure("Todo not found");
                }

                // Preserve original creation time and completed status
                todo.CreatedAt = existingTodo.CreatedAt;
                todo.IsCompleted = existingTodo.IsCompleted;
                todo.CompletedAt = existingTodo.CompletedAt;

                await _todoRepository.UpdateAsync(todo);
                return Result.Success();
            }
            catch (Exception)
            {
                return Result.Failure("An error occurred while updating the todo");
            }
        }

        public async Task<Result> DeleteTodoAsync(int id)
        {
            if (id <= 0)
            {
                return Result.Failure("Todo ID must be positive");
            }

            try
            {
                var todo = await _todoRepository.GetByIdAsync(id);
                if (todo == null)
                {
                    return Result.Failure("Todo not found");
                }

                var deleted = await _todoRepository.DeleteAsync(todo);
                return deleted ? Result.Success() : Result.Failure("Failed to delete todo");
            }
            catch (Exception)
            {
                return Result.Failure("An error occurred while deleting the todo");
            }
        }

        public async Task<Result<Todo>> ToggleTodoStatusAsync(int id)
        {
            if (id <= 0)
            {
                return Result<Todo>.Failure("Todo ID must be positive");
            }

            try
            {
                var todo = await _todoRepository.GetByIdAsync(id);
                if (todo == null)
                {
                    return Result<Todo>.Failure("Todo not found");
                }

                todo.IsCompleted = !todo.IsCompleted;
                todo.CompletedAt = todo.IsCompleted ? DateTime.UtcNow : null;

                await _todoRepository.UpdateAsync(todo);
                return Result<Todo>.Success(todo);
            }
            catch (Exception)
            {
                return Result<Todo>.Failure("An error occurred while toggling todo status");
            }
        }
    }
}