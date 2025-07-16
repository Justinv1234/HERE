/**
 * Utility function to export data to CSV
 */
export function exportToCSV(data: any[], filename: string) {
  // Skip if no data or running on server
  if (!data || !data.length || typeof window === "undefined") return

  // Format date for filename
  const date = new Date().toISOString().slice(0, 10)
  const csvFilename = `${filename}-${date}.csv`

  // Convert object to CSV row
  const processRow = (row: any) => {
    const keys = Object.keys(row)
    const processedRow = keys
      .map((key) => {
        let cell = row[key]

        // Format dates
        if (cell instanceof Date) {
          cell = cell.toISOString().split("T")[0]
        }

        // Format duration (seconds to hours)
        if (key === "duration" && typeof cell === "number") {
          cell = (cell / 3600).toFixed(2) + " hours"
        }

        // Handle special characters and quotes
        if (typeof cell === "string") {
          // Escape quotes
          cell = cell.replace(/"/g, '""')
          // Wrap in quotes if contains comma, newline or quote
          if (cell.includes(",") || cell.includes("\n") || cell.includes('"')) {
            cell = `"${cell}"`
          }
        }

        return cell
      })
      .join(",")

    return processedRow
  }

  // Get headers (column names)
  const headers = Object.keys(data[0])
    .map((header) => {
      // Format header for readability
      const formatted = header.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

      return formatted
    })
    .join(",")

  // Process all rows
  const csvRows = data.map(processRow)

  // Combine headers and rows
  const csvContent = [headers, ...csvRows].join("\n")

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.setAttribute("href", url)
  link.setAttribute("download", csvFilename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
