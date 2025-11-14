using CashflowAi_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CashflowAi_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BacktestController : ControllerBase
{
    private readonly BacktestService _service;

    public BacktestController(BacktestService service) => _service = service;


    [HttpPost]
    public ActionResult<BacktestResult> Post([FromBody] BacktestRequest request)
    {
        try
        {
            var result = _service.Run(request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return UnprocessableEntity(new { error = ex.Message });
        }
    }

    [HttpGet("/health")]
    public IActionResult Health() => Ok(new { ok = true, name = "Cashflow AI Backtester (Controllers)" });
}