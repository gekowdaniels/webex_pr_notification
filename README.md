# Webex Pull Request Notification

This GitHub Action send a Webex notification to all reviewers.

## Assumptions

  - The user's email in Github is the same as the Webex user email

## Secrets

  - 'WEBEX_TOKEN`: The Webex api token

## ENV

  - `GITHUB_CONTEXT`: A json formate of github value

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
    uses: gekowdaniels/webex_pr_notification@v1.0.0-alpha
    secrets:
      WEBEX_TOKEN:  ${{ secrets.WEBEX_TOKEN }}
    env:
        GITHUB_CONTEXT: ${{ toJson(github) }}

