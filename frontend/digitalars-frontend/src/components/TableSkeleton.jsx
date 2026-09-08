import { Skeleton, TableCell, TableRow } from "@mui/material";

function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={`skeleton-col-${colIndex}`}>
              <Skeleton
                animation="wave"
                variant={colIndex === 0 ? "circular" : "text"}
                width={colIndex === 0 ? 32 : "85%"}
                height={colIndex === 0 ? 32 : 24}
                sx={{ borderRadius: 1 }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default TableSkeleton;
