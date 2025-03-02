using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Todo
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters")]
        public string Description { get; set; } = string.Empty;
        
        public bool IsCompleted { get; set; }
        
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [DataType(DataType.DateTime)]
        public DateTime? CompletedAt { get; set; }
    }
}