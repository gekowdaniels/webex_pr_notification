# Webex Pull Request Notification

This GitHub Action send a Webex notification to all reviewers.

## Assumptions

  - The user's email in Github is the same as the Webex user email

## Secrets

  - 'WEBEX_TOKEN`: The Webex api token

## Example Usage

```yaml
name: Webex pr notification

on:
  pull_request:
    types: [opened, ready_for_review]
jobs:
  webex:
    permissions:
      contents: read
    uses: gekowdaniels/webex_pr_notification
    secrets:
      WEBEX_TOKEN:  ${{ secrets.WEBEX_TOKEN }}

