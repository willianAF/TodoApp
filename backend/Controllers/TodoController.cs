using backend.Models;
using backend.Services;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;

        public TodoController(ITodoService todoService)
        {
            _todoService = todoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> GetTodos([FromQuery] string? search)
        {
            var result = await _todoService.GetAllTodosAsync(search);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }
            return Ok(result.Value);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Todo>> GetTodo(int id)
        {
            var result = await _todoService.GetTodoByIdAsync(id);
            if (!result.IsSuccess)
            {
                return result.Error.Contains("not found") ? NotFound(result.Error) : BadRequest(result.Error);
            }
            return Ok(result.Value);
        }

        [HttpPost]
        public async Task<ActionResult<Todo>> CreateTodo(Todo todo)
        {
            var result = await _todoService.CreateTodoAsync(todo);
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }
            return CreatedAtAction(nameof(GetTodo), new { id = result.Value.Id }, result.Value);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, Todo todo)
        {
            var result = await _todoService.UpdateTodoAsync(id, todo);
            if (!result.IsSuccess)
            {
                return result.Error.Contains("not found") ? NotFound(result.Error) : BadRequest(result.Error);
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var result = await _todoService.DeleteTodoAsync(id);
            if (!result.IsSuccess)
            {
                return result.Error.Contains("not found") ? NotFound(result.Error) : BadRequest(result.Error);
            }
            return NoContent();
        }

        [HttpPatch("{id}/toggle")]
        public async Task<ActionResult<Todo>> ToggleTodoStatus(int id)
        {
            var result = await _todoService.ToggleTodoStatusAsync(id);
            if (!result.IsSuccess)
            {
                return result.Error.Contains("not found") ? NotFound(result.Error) : BadRequest(result.Error);
            }
            return Ok(result.Value);
        }
    }
}