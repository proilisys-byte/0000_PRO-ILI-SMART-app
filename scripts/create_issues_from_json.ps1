$repo = "proilisys-byte/0000_PRO-ILI-SMART-app"
$projectNum = 2
$owner = "proilisys-byte"

$issues = Get-Content -Path "$PSScriptRoot\issues.json" -Raw -Encoding UTF8 | ConvertFrom-Json

$count = 0
foreach ($issue in $issues) {
    $count++
    Write-Host "[$count/$($issues.Count)] Creating: $($issue.title)"
    
    $bodyFile = Join-Path $env:TEMP "gh_issue_body_$count.md"
    $issue.body | Out-File -FilePath $bodyFile -Encoding utf8
    
    $labelStr = ($issue.labels | ForEach-Object { "--label `"$_`"" }) -join " "
    $cmd = "gh issue create --repo $repo --title `"$($issue.title)`" --body-file `"$bodyFile`" $labelStr"
    
    $result = Invoke-Expression $cmd 2>&1
    Remove-Item $bodyFile -Force -ErrorAction SilentlyContinue
    
    if ($result -match "(https://github.com/.+/issues/\d+)") {
        $url = $Matches[1].Trim()
        Write-Host "  Issue created: $url"
        gh project item-add $projectNum --owner $owner --url $url 2>&1 | Out-Null
        Write-Host "  Added to project"
    } else {
        Write-Host "  ERROR: $result" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 1200
}

Write-Host "`nDone! Created $count issues."
