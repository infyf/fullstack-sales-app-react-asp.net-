using bild.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization; // ����� ��� ReferenceHandler

var builder = WebApplication.CreateBuilder(args);

// ������ ���������� � ������������ �����
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Swagger ��� ���������� API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ϳ��������� �� ���� �����
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ������ ������� CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ��������� CORS
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
