$owner = "proilisys-byte"
$projectNum = 2
$repo = "proilisys-byte/0000_PRO-ILI-SMART-app"

# Get project ID
$projectId = "PVT_kwHOEGxidc4BX4Fr"

# Field IDs from earlier query
$startDateFieldId = "PVTF_lAHOEGxidc4BX4FrzhTB7iA"
$targetDateFieldId = "PVTF_lAHOEGxidc4BX4FrzhTB7iE"
$statusFieldId = "PVTSSF_lAHOEGxidc4BX4FrzhTB65A"
$todoOptionId = "f75ad846"

# Issue dates mapping (issue number -> start, end)
$dates = @{
    1  = @("2026-05-19", "2026-05-20")  # T1-001
    2  = @("2026-05-21", "2026-05-22")  # T1-002
    3  = @("2026-05-21", "2026-05-22")  # T1-003
    4  = @("2026-05-22", "2026-05-23")  # T1-004
    5  = @("2026-05-19", "2026-05-20")  # T1-005
    6  = @("2026-05-19", "2026-05-20")  # T1-006
    7  = @("2026-05-19", "2026-05-20")  # T1-007
    8  = @("2026-05-21", "2026-05-23")  # T1-008
    9  = @("2026-05-23", "2026-05-25")  # T1-009
    10 = @("2026-05-19", "2026-05-22")  # T1-010
    11 = @("2026-05-22", "2026-05-23")  # T1-011
    12 = @("2026-05-21", "2026-05-22")  # T1-012
    13 = @("2026-05-21", "2026-05-22")  # T1-013
    14 = @("2026-05-21", "2026-05-22")  # T1-014
    15 = @("2026-05-23", "2026-05-25")  # T2-001
    16 = @("2026-05-21", "2026-05-22")  # T2-002
    17 = @("2026-05-24", "2026-05-26")  # T2-003
    18 = @("2026-05-21", "2026-05-22")  # T2-004
    19 = @("2026-05-26", "2026-05-27")  # T2-005
    20 = @("2026-05-24", "2026-05-25")  # T3-001
    21 = @("2026-05-23", "2026-05-24")  # T3-002
    22 = @("2026-05-25", "2026-05-26")  # T3-003
    23 = @("2026-05-23", "2026-05-24")  # T3-004
    24 = @("2026-05-25", "2026-05-26")  # T3-005
    25 = @("2026-05-24", "2026-05-25")  # T3-006
    26 = @("2026-05-28", "2026-05-29")  # T4-001
    27 = @("2026-05-26", "2026-05-27")  # T4-002
    28 = @("2026-05-26", "2026-05-27")  # T4-003
    29 = @("2026-05-26", "2026-05-27")  # T4-004
    30 = @("2026-05-30", "2026-06-02")  # T4-005
}

# Get all project items
Write-Host "Fetching project items..."
$items = gh project item-list $projectNum --owner $owner --format json | ConvertFrom-Json

foreach ($item in $items.items) {
    # Extract issue number from URL
    if ($item.content.url -match "/issues/(\d+)$") {
        $issueNum = [int]$Matches[1]
        if ($dates.ContainsKey($issueNum)) {
            $startDate = $dates[$issueNum][0]
            $targetDate = $dates[$issueNum][1]
            $itemId = $item.id
            
            Write-Host "Setting dates for Issue #$issueNum ($startDate ~ $targetDate)..."
            
            # Set Start date
            gh project item-edit --project-id $projectId --id $itemId --field-id $startDateFieldId --date $startDate 2>&1 | Out-Null
            
            # Set Target date
            gh project item-edit --project-id $projectId --id $itemId --field-id $targetDateFieldId --date $targetDate 2>&1 | Out-Null
            
            # Set Status to Todo
            gh project item-edit --project-id $projectId --id $itemId --field-id $statusFieldId --single-select-option-id $todoOptionId 2>&1 | Out-Null
            
            Write-Host "  Done"
            Start-Sleep -Milliseconds 500
        }
    }
}

Write-Host "`nAll dates set!"
