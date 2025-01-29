
async function notifyWebex() {
    const contextEvent = JSON.parse(process.env.GITHUB_CONTEXT).event;
    const prLink = contextEvent.pull_request._links.html.href;
    const teams = contextEvent.pull_request.requested_teams.map(({ name }) => name);
    const title = contextEvent.pull_request.title;
    const createdBy = contextEvent.pull_request.user.login;
    const body = contextEvent.pull_request.body;

    const requestedReviewers = await Promise.all(contextEvent.pull_request.requested_reviewers.map(async({ login }) => await getReviewerEmail(login)));
    await Promise.all(requestedReviewers.map(({toPersonEmail}) => sendNotification(toPersonEmail, title, prLink, createdBy, body)));
}

async function getReviewerEmail(reviewerLogin) {
    const response = await fetch(
        `https://api.github.com/users/${reviewerLogin}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    const content = await response.json();
    return {"toPersonEmail": content.email};
}

async function sendNotification(toPersonEmail, title, prLink, createdBy, body) {
    const url = `https://webexapis.com/v1/messages`;
    const payload = {
        markdown: `**GitHub Pull Request Notification**\n\nReview requested for: ${title} by ${createdBy} with the following message:\n${body}`,
        toPersonEmail: toPersonEmail
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.WEBEX_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const content = await response.json();
}

// Invoke the function
notifyWebex().catch((error) => {
    console.error('Error notifying Webex:', error);
    process.exit(1);
});