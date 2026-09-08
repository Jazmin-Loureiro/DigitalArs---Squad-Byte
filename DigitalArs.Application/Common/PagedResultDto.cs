using System.Collections.Generic;

namespace DigitalArs.Application.Common;

public class PagedResultDto<T>
{
    public int CurrentPage { get; set; }
    public int Page => CurrentPage;
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalItems => TotalCount;
    public int TotalPages { get; set; }
    public bool HasPreviousPage => CurrentPage > 1;
    public bool HasNextPage => CurrentPage < TotalPages;
    public IEnumerable<T> Items { get; set; } = new List<T>();

    public PagedResultDto() { }

    public PagedResultDto(IEnumerable<T> items, int totalCount, int currentPage, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        CurrentPage = currentPage;
        PageSize = pageSize;
        TotalPages = (int)System.Math.Ceiling(totalCount / (double)pageSize);
    }
}