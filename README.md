![pre-interview-brief](https://user-images.githubusercontent.com/27579184/233307058-7bc01779-30c5-46fd-963e-3475281908b5.jpg)


## Description

## Use case

When a candidate applies for a job, they’d like to learn more about the person who is interviewing them. We have a designated email address - pmb@aristotlehq.com email which you can send an email that will trigger the workflow. In the email body - they write in natural language - their LinkedIn profile, then the LinkedIn profile of the person they are meeting alongside the company they are interviewing for.

## Notes

- When building this system, please use NestJS for the backend, and use BullMQ message processor for taking in the request and running the scraping processors.
- For scraping - look at the below library implemented in Python that uses GPT3 to scrape. Use the method used by that to do it on node js.
    
    [https://jamesturk.github.io/scrapeghost/](https://jamesturk.github.io/scrapeghost/)
    
- Please use xState https://github.com/statelyai/xstate to maintain a state machine on the backend for each request that comes in.
- Use Prisma for ORM and PostgreSQL for database.
- You are welcome to use ChatGPT / GitHub Co-pilot to deliver this project.
- Assume that the starting point of your application is a webhook calling with an email subject and body from a service like SendGrid.
- This is a tool/ service/ product used by candidates, and you are going to charge them $5 in the future. This tool is not how you apply for a job.

## Completed tasks.
- Backend API which process the request and generate brief with OpenAI models.

## Pending tasks
- Email trigger integration
- Scraping (this is a blocker as linkedin limitations on scraping)
- state machine and queue based asynchronous processing

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm run start
```

# Limitations
- Linkedin profile page cannot be scraped as Linkedin has taken several measures to block it.

# Request payload structure
POST pre-interview-brief-generator-production.up.railway.app/brief

{
    "companyProfileUrl": "https://www.linkedin.com/company/aristotlehq/about/",
    "jobPostUrl": "https://www.ycombinator.com/companies/strac/jobs/y0Mopqu-sales-development-representative-sdr",
    "interviewerLinkedInProfileUrl": "https://lk.linkedin.com/in/dulithawijewantha"
}

## License

Nest is [MIT licensed](LICENSE).
