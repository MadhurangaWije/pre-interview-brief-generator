import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { getCompanySummary, getConversationStartersBasedOnLinkedInActivity, getJobPostingInformation, getSummary } from './llm.utils';
import { TRANSCODE_QUEUE } from './constants';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { createMachine } from 'xstate';
import { InterviewBriefRequestDto } from './InterviewBriefRequestDto';



@Injectable()
export class AppService {
  healthCheck(): string {
    return 'OK';
  }

  constructor(@InjectQueue(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue, private readonly httpService: HttpService){}


  async generatePreInterviewBriefAsync(dto: InterviewBriefRequestDto, service: any): Promise<any> {
    return this.transcodeQueue.add({data: dto, service: service});
  }

  async generatePreInterviewBriefSync(dto: InterviewBriefRequestDto): Promise<any> {

    const preInterviewBrief = {interviewer:{}}
    // const markup = this.httpService.get('https://proxy.scrapeops.io/v1/?api_key=af8e6897-25d2-44ac-86be-05361e142654&url=${dto.interviewerLinkedInProfileUrl}');

    // IMPORTANT: Hardcoded markup since Linkedin is blocking the scraping even via proxy.

    const markup2 = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="pageKey" content="public_profile_v3_desktop">
      <meta name="linkedin:pageTag" content="openToProvider">
    <meta name="locale" content="en_US">
    <meta id="config" data-app-version="2.0.1067" data-call-tree-id="AAX5rQ+ZLb9/4D+yXRmROA==" data-multiproduct-name="public-profile-frontend" data-service-name="public-profile-frontend" data-browser-id="cc965f76-c69c-4efc-8596-b5381e65686e" data-enable-page-view-heartbeat-tracking data-disable-comscore-tracking data-page-instance="urn:li:page:public_profile_v3;Z64X4UhDSA2Th17HCWPmjw==" data-disable-jsbeacon-pagekey-suffix="false" data-member-id="0" data-msafdf-lib="https://static.licdn.com/aero-v1/sc/h/6r58rkh35e7x4dqy7terugz6s" data-logout-url="/uas/logout" data-is-li-sugr-tracking-enabled>

    <link rel="canonical" href="https://sg.linkedin.com/in/dulithawijewantha">
<!----><!---->
<!---->
<!---->
      <meta property="al:android:url" content="https://sg.linkedin.com/in/dulithawijewantha">
      <meta property="al:android:package" content="com.linkedin.android">
      <meta property="al:android:app_name" content="LinkedIn">
      <meta property="al:ios:url" content="https://sg.linkedin.com/in/dulithawijewantha">
      <meta property="al:ios:app_store_id" content="288429040">
      <meta property="al:ios:app_name" content="LinkedIn">

<!---->
      <link rel="icon" href="https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca">

    <script>
      function getDfd() {let yFn,nFn;const p=new Promise(function(y, n){yFn=y;nFn=n;});p.resolve=yFn;p.reject=nFn;return p;}
      window.lazyloader = getDfd();
      window.tracking = getDfd();
      window.impressionTracking = getDfd();
      window.ingraphTracking = getDfd();
      window.appDetection = getDfd();
      window.pemTracking = getDfd();
    </script>

<!---->
    
    <title>Dulitha Wijewantha -  Co-Founder &amp; CTO - Aristotle - Co-Pilot for Cold Sales | LinkedIn</title>

    



<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="litmsProfileName" content="public-profile-frontend">

  <meta name="ubba" content="https://static.licdn.com/aero-v1/sc/h/1qha5a18714fz8dczp2mykaax">

<meta name="platform" content="https://static.licdn.com/aero-v1/sc/h/8mp6num02g91q0ebr3tkbyk8z">
<meta name="platform-worker" content="https://static.licdn.com/aero-v1/sc/h/7nirg34a8ey4y2l4rw7xgwxx4">







  <meta name="description" content="Hi!🙋🏾‍♂️<br><br>I am a problem solver, who is in the business of helping startups and enterprises solve their business challenges, fix ineffective business processes and increase revenue 💹; via digitization . <br><br>In order to help organizations realize their digital goal, I co-founded CabbageApps, as a technology partner. Half a decade has passed since its launch and the company has developed and delivered #Tech products for clients acquiring over a million users 📈.<br><br>I bring with me 10+ years of experience, varying from the development of an open-source product, working with fortune 500 companies, to assisting customers with their technology buying process and developing a custom solutions to customers all over the world 🌍 .<br><br>🙋🏾‍♂️ Talk to me about: <br><br>⚡️Fintech<br>⚡️Product Development<br>⚡️UI/UX<br>⚡️JavaScript<br>⚡️Psychology <br>⚡️Machine Learning.<br> | Learn more about Dulitha Wijewantha's work experience, education, connections &amp; more by visiting their profile on LinkedIn">
  <meta name="og:description" content="Hi!🙋🏾‍♂️<br><br>I am a problem solver, who is in the business of helping startups and enterprises solve their business challenges, fix ineffective business processes and increase revenue 💹; via digitization . <br><br>In order to help organizations realize their digital goal, I co-founded CabbageApps, as a technology partner. Half a decade has passed since its launch and the company has developed and delivered #Tech products for clients acquiring over a million users 📈.<br><br>I bring with me 10+ years of experience, varying from the development of an open-source product, working with fortune 500 companies, to assisting customers with their technology buying process and developing a custom solutions to customers all over the world 🌍 .<br><br>🙋🏾‍♂️ Talk to me about: <br><br>⚡️Fintech<br>⚡️Product Development<br>⚡️UI/UX<br>⚡️JavaScript<br>⚡️Psychology <br>⚡️Machine Learning.<br> | Learn more about Dulitha Wijewantha's work experience, education, connections &amp; more by visiting their profile on LinkedIn">
  <meta name="twitter:description" content="Hi!🙋🏾‍♂️<br><br>I am a problem solver, who is in the business of helping startups and enterprises solve their business challenges, fix ineffective business processes and increase revenue 💹; via digitization . <br><br>In order to help organizations realize their digital goal, I co-founded CabbageApps, as a technology partner. Half a decade has passed since its launch and the company has developed and delivered #Tech products for clients acquiring over a million users 📈.<br><br>I bring with me 10+ years of experience, varying from the development of an open-source product, working with fortune 500 companies, to assisting customers with their technology buying process and developing a custom solutions to customers all over the world 🌍 .<br><br>🙋🏾‍♂️ Talk to me about: <br><br>⚡️Fintech<br>⚡️Product Development<br>⚡️UI/UX<br>⚡️JavaScript<br>⚡️Psychology <br>⚡️Machine Learning.<br> | Learn more about Dulitha Wijewantha's work experience, education, connections &amp; more by visiting their profile on LinkedIn">

<meta property="og:title" content="Dulitha Wijewantha -  Co-Founder &amp;amp; CTO - Aristotle - Co-Pilot for Cold Sales | LinkedIn">
<meta property="og:image" content="https://media.licdn.com/dms/image/D5603AQEgXzNMajwHjQ/profile-displayphoto-shrink_800_800/0/1666268942675?e=2147483647&amp;v=beta&amp;t=yK-DC4Zw0JElJ2xINGZB1uzMuKF1JGcFyaUCDVLcJCI">
<meta property="og:type" content="profile">

  <meta property="profile:first_name" content="Dulitha">

  <meta property="profile:last_name" content="Wijewantha">

  <meta property="og:url" content="https://sg.linkedin.com/in/dulithawijewantha">

<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@Linkedin">
<meta name="twitter:title" content="Dulitha Wijewantha -  Co-Founder &amp;amp; CTO - Aristotle - Co-Pilot for Cold Sales | LinkedIn">
<meta name="twitter:image" content="https://media.licdn.com/dms/image/D5603AQEgXzNMajwHjQ/profile-displayphoto-shrink_800_800/0/1666268942675?e=2147483647&amp;v=beta&amp;t=yK-DC4Zw0JElJ2xINGZB1uzMuKF1JGcFyaUCDVLcJCI">

<!---->
<!---->
  <meta name="linkedin:pageTag" content="openToProvider">

<meta name="robots" content="noarchive">


      <meta name="clientSideIngraphs" content="1" data-gauge-metric-endpoint="/public-profile/api/ingraphs/guestGauge" data-counter-metric-endpoint="/public-profile/api/ingraphs/counter">

<!---->
    <link rel="stylesheet" href="https://static.licdn.com/aero-v1/sc/h/ew93bnqzc9gosf4vfd82yhvbt">

    
<script type="application/ld+json">
  {"@context":"http://schema.org","@graph":[{"@type":"Article","name":"Working ON the business vs IN the business","author":{"@type":"Person","name":"Dulitha Wijewantha","url":"https://sg.linkedin.com/in/dulithawijewantha"},"articleBody":"\u003Cp\u003EIn all my years as an Entrepreneur and Founder, I’ve realized that society has a very warped idea of the role an Entrepreneur plays in a business. More often than not, our success is equated to our involvement in day-to-day functions and the number of hours we invest in our companies when in reality it is the exact opposite.\u003C/p\u003E\u003Cp\u003EI recently came across this quote which I think perfectly summed up my idea of a successful Entrepreneur. “If an Entrepreneur is unable to take a month off, and have their day-to-day business functions run smoothly, they have failed.” \u003C/p\u003E\u003Ch3\u003ETaking a month off\u003C/h3\u003E\u003Cp\u003EWhile at the very beginning, most of us may have to take on the role of both the employee and the employer, as our business grows this changes drastically. We shed our day-to-day responsibilities and take on our true role as change-makers. This means that even with us not present, our business’s basic functions need to run smoothly.\u003C/p\u003E\u003Cp\u003EIf we take a look at basic economics, a business is usually broken down into land, labour, capital, and entrepreneurship. The functionality of a business falls into land, labour, and capital, while entrepreneurship stands apart. This is because our role is not a functional one; if it were we’d just fall under labour as well.\u003C/p\u003E\u003Cp\u003EInstead, our role is value expansion, it is to grow our businesses by an X amount each year. So while land, labour, and capital help run our day-to-day smoothly, we help take the business to another level.\u003C/p\u003E\u003Cp\u003EOur businesses go through several stages, there is the 0 to 1 stage, the 1 to 10 stage, and the 10 to 1,000 stage. As Founders our focus should be pushing through to each of these stages, but some stages are better kept in the hands of our teams.\u003C/p\u003E\u003Cp\u003EThis is what truly separates successful entrepreneurs from the rest. Our goal is to work on the business, and not in it.\u003C/p\u003E\u003Cdiv class=\"slate-resizable-image-embed slate-image-embed__resize-full-width\"\u003E\u003Cimg alt=\"No alt text provided for this image\" data-media-urn=\"\" data-li-src=\"https://media.licdn.com/dms/image/C5612AQEzDP8ATd1p-A/article-inline_image-shrink_1000_1488/0/1628068439673?e=1687392000&amp;v=beta&amp;t=8pTxDkutxwbloa7z96n6fLeibQZrlyPe7PjEru9Unbo\" src=\"//:0\"\u003E\u003C/div\u003E\u003Ch3\u003EAre you “in” or “on” your business?\u003C/h3\u003E\u003Cp\u003EAs I pointed out earlier, most of the time people mistake the role of an Entrepreneur to be working in the business, with the general assumption being that we manage vendors, office teams and make the payroll. But in reality, these are roles of those in the business, such as team members who run the business, office managers who handle administrative tasks, and the accounting teams who keep a running total of all income and expenses.\u003C/p\u003E\u003Cp\u003EAs Entrepreneurs, we stand outside this daily functional spectrum.\u003C/p\u003E\u003Cp\u003EOur goal is to work on the business, by building it, scaling it, and governing our companies and team members. While these roles alone can be daunting, we are also tasked with consistently creating, recognizing, and capturing opportunities.\u003C/p\u003E\u003Cp\u003EThis makes your role radically different from thinking about how to improve your company’s marketing or sales. It’s about how you define the next stage of the business and how you as a business owner navigate the business to that stage.\u003C/p\u003E\u003Cp\u003EIn my experience, a business can never be successful until you start focusing on the latter. Improving your business each year will be the toughest hurdles you face as an owner, so you can’t waste your time on the day-to-day; that has to be taken care of by the systems you have put in place and the people you have hired.\u003C/p\u003E\u003Cp\u003EIf you want to achieve a level of success that will last, you need to create this balance when it comes to the roles of the team and your roles as the business owner. Otherwise, you will end up playing the role of the labourer and not the entrepreneur.\u003C/p\u003E\u003Ch3\u003EWorking on your business = opportunities\u003C/h3\u003E\u003Cp\u003EWhen you start working on your business and not just in your business, you’re also expanding your business into new opportunities and new markets. You’re not just doing the same thing over and over again.\u003C/p\u003E\u003Cp\u003ESo it is on you, as the owner, to constantly look for new opportunities that will elevate your business to the next level.\u003C/p\u003E\u003Cblockquote\u003EAs the Co-founder and CEO of CabbageApps, I have experienced firsthand how important it is to be constantly looking for business opportunities. I spend the majority of my time looking outwards, talking to customers, and observing platforms like Twitter, Facebook, Instagram, and LinkedIn, and seeing whose interesting to have a conversation. These conversations tend to present opportunities over time.\u003C/blockquote\u003E\u003Cp\u003EThese opportunities are not just customers but potential new hires, new investors and new partners.\u003C/p\u003E\u003Cp\u003EIt is very easy for us to miss business opportunities when we aren’t looking. So as a business owner, you need to dedicate more time towards researching future opportunities, and not the day-to-day functions of your company.\u003C/p\u003E\u003Cp\u003EOnce you’ve seen these opportunities, you can begin setting your goals accordingly. All this will add up to your bigger picture, and your role will be to slowly work on your business and grow your business into what it can be.\u003C/p\u003E\u003Cp\u003E__________________________________________________________________________\u003C/p\u003E\u003Cp\u003E\u003Cem\u003EIf you’re a founder looking for advice from someone who has been in your shoes, follow me on my LinkedIn and get updated on more entrepreneurial hacks that will aid your business.\u003C/em\u003E\u003C/p\u003E","url":"https://www.linkedin.com/pulse/working-business-vs-dulitha-wijewantha"},{"@type":"Article","name":"A change in scenery to stimulate the brain","author":{"@type":"Person","name":"Dulitha Wijewantha","url":"https://sg.linkedin.com/in/dulithawijewantha"},"articleBody":"\u003Cp\u003ELately, I have realized that my location makes a big difference when it comes to productivity fluctuations.\u003C/p\u003E\u003Cp\u003ETake a scenario where you wake up early in the morning, let’s say 5 AM? and you do concentrated work at your home study for 2 hours.\u003C/p\u003E\u003Cp\u003EThe desk you work at and the arrangement around it will be registered by your brain as a place where you usually work on a particular activity. If you always do your writing at this desk, the next time you sit down at this desk to write, words will come flowing out of you. You wouldn't be procrastinating for hours like you usually would.\u003C/p\u003E\u003Ch2\u003EAssociated Memories\u003C/h2\u003E\u003Cp\u003EThe thing about locations is that the brain has an associated memory for every type of task you do.\u003C/p\u003E\u003Cp\u003ELet’s say you have a particular spot in your office where you usually take your sales calls. When you have more and more calls in this same spot, you’d start to get better at it cause you associate your outgoing nature to this particular location.\u003C/p\u003E\u003Cp\u003EThis is also why you really need to avoid working in bed. You won't be able to get any sleep because your brain will be confused - do I sleep or do I work now?\u003C/p\u003E\u003Ch2\u003EYou need a bit of variety\u003C/h2\u003E\u003Cp\u003EAs of late, I've started to look closely at the location variation in my calendar.\u003C/p\u003E\u003Cp\u003EI have a couple of coffee shops I go to, to do different types of work.\u003C/p\u003E\u003Cp\u003EBarefoot cafe is the place I go to do my investor or fundraising activities and I go to the Barista near the office to work on administrative activities.\u003C/p\u003E\u003Cp\u003EWhenever I vary the location in between some tasks, I get a boost in my productivity. If I work for more than 2 hours at a single location, I start to feel the fatigue.\u003C/p\u003E\u003Cp\u003ESo I switch my location and I am refreshed again.\u003C/p\u003E\u003Ch2\u003EHow can you get started?\u003C/h2\u003E\u003Cp\u003EThe trick at first is to put your work schedule in a calendar.\u003C/p\u003E\u003Cp\u003EOnce you have it in a calendar, you can use it as a visual guide to figure out the types of tasks you have. Do they involve a particular skill such as writing? Do they require a certain temperament, such as having an outgoing nature?\u003C/p\u003E\u003Cp\u003EWhen you notice the categories your tasks fall into, you start to realize which locations are ideal for those types of tasks. Then you slowly get into the habit of doing that type of work in the said location.\u003C/p\u003E\u003Ch2\u003EIn summary\u003C/h2\u003E\u003Cp\u003EI am not saying that this would increase your productivity a thousandfold. However, you'll start to realize that as your progress, you will be more productive, more consistently.\u003C/p\u003E\u003Cp\u003ELet me know if you have been following a similar approach or if you have a different tactic to avoid procrastination.\u003C/p\u003E\u003Cp\u003EIf you've ever tried my approach, let me know in the comments below how you fared. I'm sure we could all learn something from your experience as well!\u003C/p\u003E\u003Cp\u003E\u003Cem\u003EOriginally written on - \u003C/em\u003E\u003C/p\u003E\u003Ciframe class=\"center\" frameborder=\"0\" allowfullscreen=\"true\" src=\"about:blank\" width=\"744\" title=\"Move your Butt to increase Productivity\" height=\"314\" data-li-src=\"https://www.linkedin.com/embeds/publishingEmbed.html?articleId=8558238941360545320\"\u003E\u003C/iframe\u003E\u003Cp\u003E\u003Cbr\u003E\u003C/p\u003E\u003Cp\u003E\u003Cbr\u003E\u003C/p\u003E","url":"https://www.linkedin.com/pulse/change-scenery-stimulate-thebrain-dulitha-wijewantha"},{"@type":"Article","name":"Describe your ideas in a Spec","author":{"@type":"Person","name":"Dulitha Wijewantha","url":"https://sg.linkedin.com/in/dulithawijewantha"},"articleBody":"\u003Cp\u003EOne day I noticed something interesting where we had a discussion about a topic with the whole team that’s working on the Growth Movement (\u003Cem\u003Eyep, the brand isn’t out yet but you’d hear about it pretty soon\u003C/em\u003E&nbsp;😏). We were trying to remember another discussion we had on the topic 2 weeks back but we had nothing to refer back to.\u003C/p\u003E \n  \u003Cp\u003EI went on Slack searched back in History but nothing came up. “Isn’t that pretty bad? The fact that we can’t recall something a while back?”. We went back into the discussion and after about 20 minutes I got an idea flash 💡.\u003C/p\u003E \n  \u003Cp\u003E\u003Cem\u003EWhy not we use a specification to describe the idea?\u003C/em\u003E\u003C/p\u003E \n  \u003Ch3\u003ESpecification AKA&nbsp;Spec\u003C/h3\u003E \n  \u003Cp\u003EOne of the cool things about Software is that engineers have built abstractions to manage how ideas turn into code. I am specifically talking about software specifications.\u003C/p\u003E \n  \u003Cp\u003ELet me first describe what a specification is. According to Google, “\u003Cem\u003Ea detailed description of the design and materials used to make something\u003C/em\u003E”. Taking an example into account, several people discussed in length over multiple days offline/online on the behavior of how browsers will connect to servers on the internet. Since it was hard to maintain all of this in separate discussion notes or emails, a draft document was created called a specification. This specification became the go-to point for anyone to refer back an argument or a particular reasoning behind a particular design/ implementation decision.\u003C/p\u003E \n  \u003Ch3\u003ESpecification ❤️\u003C/h3\u003E \n  \u003Cp\u003EWe decided to keep a document detailing a project that we are discussing in order to fully capture the details. The spec gets drafted multiple times by different people and each discussion or meeting we have, we update the spec. By using a Google Doc, we get the revisions support for the document and we can view the spec historically.\u003C/p\u003E \n  \u003Ch3\u003ENew Guys&nbsp;✏️\u003C/h3\u003E \n  \u003Cp\u003EWhen we onboard new people for the project, all we have to do is to ask them to go read the specification after a quick chat of the overall idea. A small technical difference between a software spec and our spec is that we capture a broad range of arguments we have about a topic so that the person reading it can get an understanding of the full discourse.\u003C/p\u003E \n  \u003Cp\u003EWhat are your thoughts on having a spec for your projects? 🤔 Let me know what you think.\u003C/p\u003E \n  \u003Cp\u003E\u003Ca href=\"https://medium.com/wizards-alakazam/describe-your-ideas-in-a-spec-2174dd269cbe\" target=\"_blank\" rel=\"nofollow noopener\"\u003ELink to Medium\u003C/a\u003E\u003C/p\u003E\n \n","url":"https://www.linkedin.com/pulse/describe-your-ideas-spec-dulitha-wijewantha"},{"@type":"PublicationIssue","name":" ￼￼￼￼￼￼￼Managing Enterprise Mobile Devices and Delivering Enterprise Mobile Applications","author":{"@type":"Person","name":"Dulitha Wijewantha","url":"https://sg.linkedin.com/in/dulithawijewantha"}},{"@type":"Person","address":{"@type":"PostalAddress","addressLocality":"Singapore"},"alumniOf":[{"@type":"Organization","name":"Hustle Fund","url":"https://lk.linkedin.com/company/hustle-fund?trk=ppro_cprof","location":"California, United States","member":{"@type":"OrganizationRole","description":"Building new initiatives and spinning up new business ideas.","startDate":"2022-10","endDate":"2023-03"}},{"@type":"Organization","name":"Carbon Planter","url":"https://lk.linkedin.com/company/carbon-planter?trk=ppro_cprof","location":"Colombo, Western Province, Sri Lanka","member":{"@type":"OrganizationRole","description":"Carbon Planter helps Businesses to gift Digital Trees for Event Attendees of Online and Offline events. The digital trees are backed by natural value of trees where we work with Tree Planters to help them bridge the supply and demand gap.","startDate":"2020-04","endDate":"2022-10"}},{"@type":"Organization","name":"alakazam","url":"https://lk.linkedin.com/company/getalakazam?trk=ppro_cprof","location":"Colombo, Sri Lanka","member":{"@type":"OrganizationRole","description":"A product focused on building an AI based Assistant for Social Media, with a focus on  the SMEs and Influencer markets. The product got featured in Tech in Asia and was exhibited in Rise Conference in Hong Kong 2018. \u003Cbr\u003E\u003Cbr\u003EIt raised capital from Third Lane Ventures, a Micro-VC based in Sri Lanka and also raised Capital from Singapore and established the business there. Alakazam also participated in the AI/ Blockchain Accelerator in Taiwan conducted by AppWorks.","startDate":"2017-07","endDate":"2020-01"}},{"@type":"Organization","name":"WSO2","url":"https://lk.linkedin.com/company/wso2?trk=ppro_cprof","location":"Colombo","member":{"@type":"OrganizationRole","description":"A four year career (2013-2017) as a Software Engineer at one of Sri Lanka's biggest open-source technology providers. \u003Cbr\u003E\u003Cbr\u003EHandled both the US 🇺🇲and Australian🇭🇲 markets, and made my transition from Engineering to Marketing and Sales.","startDate":"2015-04","endDate":"2017-03"}},{"@type":"Organization","name":"WSO2","url":"https://lk.linkedin.com/company/wso2?trk=ppro_cprof","location":"Colombo","member":{"@type":"OrganizationRole","description":"Building the next generation Mobile Device Management console.","startDate":"2013-04","endDate":"2015-04"}},{"@type":"Organization","name":"DSI Samson Group - Sri Lanka","url":"https://lk.linkedin.com/company/dsi-samson-group---sri-lanka?trk=ppro_cprof","location":"Slave Island, Sri Lanka","member":{"@type":"OrganizationRole","description":"Design and Development of the new Point of Sales system\u003Cbr\u003EGame Changer application for Order Management\u003Cbr\u003ETrackIT application for Ticket Processing\u003Cbr\u003EAnton Inventory Management System","startDate":"2012-03","endDate":"2013-04"}},{"@type":"Organization","name":"Azbow","url":"https://lk.linkedin.com/company/azbow?trk=ppro_cprof","location":"Sri Lanka","member":{"@type":"OrganizationRole","description":"Working and Handling  Software Application development for Custom solutions","startDate":"2011-11","endDate":"2012-03"}},{"@type":"Organization","name":"Azbow","url":"https://lk.linkedin.com/company/azbow?trk=ppro_cprof","member":{"@type":"OrganizationRole","description":"Building Custom Applications for Business Automation","startDate":"2011-09","endDate":"2011-11"}},{"@type":"Organization","name":"Azbow","url":"https://lk.linkedin.com/company/azbow?trk=ppro_cprof","location":"Sri Lanka","member":{"@type":"OrganizationRole","description":"Building Java SE applications to different business sectors and building Websites in PHP.","startDate":"2011-07","endDate":"2011-09"}},{"@type":"Organization","name":"TechHamlet","member":{"@type":"OrganizationRole","description":"Hitting traffic deadlines and making effective voice in the community of Tech enthusiasts to market TechHamlet.","startDate":"2011-09","endDate":"2011-11"}},{"@type":"Organization","name":"TechHamlet","location":"Sri Lanka","member":{"@type":"OrganizationRole","description":"Writing awesome tutorials, latest news and tips and tricks for TechHamlet","startDate":"2011-02","endDate":"2011-07"}},{"@type":"Organization","name":"Dryoid","member":{"@type":"OrganizationRole","description":"Standalone application development, Web application development and Mobile application development integrating Java Technology.","startDate":"2010-12","endDate":"2011-07"}},{"@type":"EducationalOrganization","name":"National University of Ireland, Galway","url":"https://lk.linkedin.com/school/universityofgalway/","member":{"@type":"OrganizationRole","startDate":2012,"endDate":2013}},{"@type":"EducationalOrganization","name":"Institute of Java Technological Studies","member":{"@type":"OrganizationRole","startDate":2009,"endDate":2011}},{"@type":"EducationalOrganization","name":"Ananda College Colombo 10","member":{"@type":"OrganizationRole","startDate":2000,"endDate":2011}}],"awards":["Best Academic Achievement"],"image":{"@type":"ImageObject","contentUrl":"https://media.licdn.com/dms/image/D5603AQEgXzNMajwHjQ/profile-displayphoto-shrink_800_800/0/1666268942675?e=2147483647&v=beta&t=yK-DC4Zw0JElJ2xINGZB1uzMuKF1JGcFyaUCDVLcJCI"},"jobTitle":[" Co-Founder & CTO","Co-Founder","Co-Founder","Board Member"],"name":"Dulitha Wijewantha","sameAs":"https://sg.linkedin.com/in/dulithawijewantha","url":"https://sg.linkedin.com/in/dulithawijewantha","memberOf":[],"worksFor":[{"@type":"Organization","name":"Aristotle - Co-Pilot for Cold Sales","url":"https://lk.linkedin.com/company/aristotlehq?trk=ppro_cprof","location":"San Francisco, California, United States","member":{"@type":"OrganizationRole","description":"We help B2B SaaS startups establish a repeatable sales process through founder-led sales. Funding was raised from HustleFund, Incisive Ventures, Unpopular Ventures, and Geek Ventures.","startDate":"2023-03"}},{"@type":"Organization","name":"CabbageApps","url":"https://lk.linkedin.com/company/cabbageapps?trk=ppro_cprof","location":"Colombo, Sri Lanka","member":{"@type":"OrganizationRole","description":"A startup focused on being a technology partner for other startups, scale ups and enterprises. We give startups aid in holistic product development; scale-ups aid in setting up a team of engineers and designers; and enterprises the advantage of Startup Thinking 💡 and Speed 💨 . \u003Cbr\u003E\u003Cbr\u003EStarting from just a team of 5, CabbageApps currently has a team of 30 and has plans to make it 200 within the next two years. ","startDate":"2017-01"}},{"@type":"Organization","name":"Hyperglade","url":"https://lk.linkedin.com/company/hyperglade?trk=ppro_cprof","location":"Singapore","member":{"@type":"OrganizationRole","description":"Sphere heading Blockchain development and conceptualizing of Product Concepts. ","startDate":"2021-06"}},{"@type":"Organization","name":"Urban.lk","url":"https://lk.linkedin.com/company/urban.lk?trk=ppro_cprof","location":"Colombo, Western, Sri Lanka","member":{"@type":"OrganizationRole","description":"Helping Urban.lk Founders in the capacity of Board Member providing Technology / Marketing Direction. ","startDate":"2020-03"}}],"knowsLanguage":[{"@type":"Language","name":"English"},{"@type":"Language","name":"French"},{"@type":"Language","name":"Japanese"}],"interactionStatistic":{"@type":"InteractionCounter","interactionType":"https://schema.org/FollowAction","name":"Follows","userInteractionCount":5740},"description":"Hi!🙋🏾‍♂️\u003Cbr\u003E\u003Cbr\u003EI am a problem solver, who is in the business of helping startups and enterprises solve their business challenges, fix ineffective business processes and increase revenue 💹; via digitization . \u003Cbr\u003E\u003Cbr\u003EIn order to help organizations realize their digital goal, I co-founded CabbageApps, as a technology partner. Half a decade has passed since its launch and the company has developed and delivered #Tech products for clients acquiring over a million users 📈.\u003Cbr\u003E\u003Cbr\u003EI bring with me 10+ years of experience, varying from the development of an open-source product, working with fortune 500 companies, to assisting customers with their technology buying process and developing a custom solutions to customers all over the world 🌍 .\u003Cbr\u003E\u003Cbr\u003E🙋🏾‍♂️ Talk to me about: \u003Cbr\u003E\u003Cbr\u003E⚡️Fintech\u003Cbr\u003E⚡️Product Development\u003Cbr\u003E⚡️UI/UX\u003Cbr\u003E⚡️JavaScript\u003Cbr\u003E⚡️Psychology \u003Cbr\u003E⚡️Machine Learning.\u003Cbr\u003E"},{"@type":"WebPage","url":"https://sg.linkedin.com/in/dulithawijewantha","reviewedBy":{"@type":"Person","name":"Dulitha Wijewantha"}}]}
</script>

  
<!---->      </head>
  <body dir="ltr">
<!---->          
      


<a href="#main-content" class="skip-link btn-md btn-primary absolute z-11 -top-[100vh] focus:top-0">
  Skip to main content
</a>

<!---->
    
<!---->
    

  <code id="isClsFixActive" style="display: none"><!--true--></code>
  


<a href="#main-content" class="skip-link btn-md btn-primary absolute z-11 -top-[100vh] focus:top-0">
  Skip to main content
</a>

<header class="header base-detail-page__header px-mobile-container-padding bg-color-background-container global-alert-offset sticky-header">
  
    






<nav class="nav pt-1.5 pb-2 flex items-center justify-between relative flex-nowrap mamabear:flex-wrap mamabear:gap-y-1 babybear:flex-wrap babybear:py-1.5
     nav--minified-mobile babybear:flex-wrap" aria-label="Primary">

  <a href="/?trk=public_profile_nav-header-logo" class="nav__logo-link link-no-visited-state z-1 mr-auto babybear:z-0 babybear:mr-0 babybear:flex-1 hover:no-underline focus:no-underline active:no-underline" data-tracking-control-name="public_profile_nav-header-logo" data-tracking-will-navigate>
      
          

<span class="sr-only">LinkedIn</span>
  <icon class="nav-logo--inbug flex text-color-brand
      papabear:hidden mamabear:hidden" data-svg-class-name="h-[34px] w-[34px] babybear:h-[27px] babybear:w-[27px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/4zqr0f9jf98vi2nkijyc3bex2"></icon>
  <icon class="block text-color-brand w-[84px] h-[21px] papabear:w-[135px] papabear:h-[34px]
      babybear:hidden" data-test-id="nav-logo" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8fkga714vy9b2wk5auqo5reeb"></icon>

      
  </a>

<!---->
    





<ul class="top-nav-menu flex items-center nav__menu order-3 after:up-down-divider after:!h-[37px] mr-0.5 babybear:hidden mamabear:hidden">
    <li class>
      
<a href="https://www.linkedin.com/pulse/topics/home/?trk=public_profile_guest_nav_menu_discover" data-tracking-control-name="public_profile_guest_nav_menu_discover" data-tracking-will-navigate class="top-nav-link flex justify-center items-center h-[52px] hover:text-color-text visited:hover:text-color-text hover:no-underline
    w-[64px] flex-col mx-1
    text-color-text-low-emphasis visited:text-color-text-low-emphasis">
  <icon class="top-nav-link__icon flex h-3 w-3 flex-shrink-0 " data-delayed-url="https://static.licdn.com/aero-v1/sc/h/5x5h6fkfoq2njo0ocxqr98mrk">
  </icon>
  <span class="top-nav-link__label-text font-sans text-sm leading-regular text-center
      font-regular">
    Discover
  </span>
</a>

    </li>
    <li class>
      
<a href="https://lk.linkedin.com/pub/dir/+/+?trk=public_profile_guest_nav_menu_people" data-tracking-control-name="public_profile_guest_nav_menu_people" data-tracking-will-navigate class="top-nav-link flex justify-center items-center h-[52px] hover:text-color-text visited:hover:text-color-text hover:no-underline
    w-[64px] flex-col mx-1
    top-nav-link--selected text-color-text visited:text-color-text border-solid border-b-2 border-color-text" aria-current="page">
  <icon class="top-nav-link__icon flex h-3 w-3 flex-shrink-0 " data-delayed-url="https://static.licdn.com/aero-v1/sc/h/7kb6sn3tm4cx918cx9a5jlb0">
  </icon>
  <span class="top-nav-link__label-text font-sans text-sm leading-regular text-center
      font-regular">
    People
  </span>
</a>

    </li>
    <li class>
      
<a href="https://lk.linkedin.com/learning/search?trk=public_profile_guest_nav_menu_learning" data-tracking-control-name="public_profile_guest_nav_menu_learning" data-tracking-will-navigate class="top-nav-link flex justify-center items-center h-[52px] hover:text-color-text visited:hover:text-color-text hover:no-underline
    w-[64px] flex-col mx-1
    text-color-text-low-emphasis visited:text-color-text-low-emphasis">
  <icon class="top-nav-link__icon flex h-3 w-3 flex-shrink-0 " data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8wykgzgbqy0t3fnkgborvz54u">
  </icon>
  <span class="top-nav-link__label-text font-sans text-sm leading-regular text-center
      font-regular">
    Learning
  </span>
</a>

    </li>
    <li class>
      
<a href="https://lk.linkedin.com/jobs/jobs-in-colombo?trk=public_profile_guest_nav_menu_jobs" data-tracking-control-name="public_profile_guest_nav_menu_jobs" data-tracking-will-navigate class="top-nav-link flex justify-center items-center h-[52px] hover:text-color-text visited:hover:text-color-text hover:no-underline
    w-[64px] flex-col mx-1
    text-color-text-low-emphasis visited:text-color-text-low-emphasis">
  <icon class="top-nav-link__icon flex h-3 w-3 flex-shrink-0 " data-delayed-url="https://static.licdn.com/aero-v1/sc/h/92eb1xekc34eklevj0io6x4ki">
  </icon>
  <span class="top-nav-link__label-text font-sans text-sm leading-regular text-center
      font-regular">
    Jobs
  </span>
</a>

    </li>
</ul>


  <div class="nav__cta-container order-3 flex gap-x-1 justify-end min-w-[100px] flex-nowrap flex-shrink-0 babybear:flex-wrap flex-2">
    

<a class="nav__button-tertiary btn-md btn-tertiary" href="https://www.linkedin.com/signup/public-profile-join?vieweeVanityName=dulithawijewantha&amp;session_redirect=https%3A%2F%2Fsg.linkedin.com%2Fin%2Fdulithawijewantha&amp;trk=public_profile_nav-header-join" data-tracking-control-name="public_profile_nav-header-join" data-test-live-nav-primary-cta data-tracking-will-navigate>
  Join now
</a>


    



  
  <a class="nav__button-secondary btn-md btn-secondary-emphasis" href="https://www.linkedin.com/login?session_redirect=https%3A%2F%2Fsg%2Elinkedin%2Ecom%2Fin%2Fdulithawijewantha&amp;fromSignIn=true&amp;trk=public_profile_nav-header-signin" data-tracking-control-name="public_profile_nav-header-signin" data-tracking-will-navigate>
      Sign in
  </a>


      <a aria-label="Sign in" class="nav__link-person papabear:hidden mamabear:hidden" data-tracking-control-name="public_profile_nav-header-signin" data-tracking-will-navigate href="https://www.linkedin.com/login?session_redirect=https%3A%2F%2Fsg%2Elinkedin%2Ecom%2Fin%2Fdulithawijewantha&amp;fromSignIn=true&amp;trk=public_profile_nav-header-signin">
        
  <img class="inline-block relative
      rounded-[50%]
      w-4 h-4
      bg-color-entity-ghost-background" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt>

      </a>
  </div>

<!---->
<!---->    </nav>

  
</header>


<!---->      

<!---->
<main class="main papabear:flex papabear:w-content-max-w papabear:mx-auto papabear:pt-desktop-content-top-margin mamabear:pt-desktop-content-top-margin
    " id="main-content" role="main">
  <section class="core-rail mx-auto papabear:w-core-rail-width mamabear:max-w-[790px] babybear:max-w-[790px]">
    
    
  

    <div class="details mx-details-container-padding">
      
    
        


  <section class="profile">
    
<!---->
  













<section class="top-card-layout container-lined overflow-hidden babybear:rounded-[0px]">
    
<figure class="cover-img min-h-[87px] papbear:min-h-[100px] rounded-t-[2px] babybear:rounded-[0px] -z-1">
<!---->      <div class="cover-img__image-frame relative w-full overflow-hidden pb-[calc((134/782)*100%)]">
    <div class="cover-img__image-position absolute top-0 right-0 bottom-0 left-0
        ">
        <img class="cover-img__image relative w-full h-full object-cover" src="https://media.licdn.com/dms/image/D5616AQFGRsFwlPN-Ig/profile-displaybackgroundimage-shrink_200_800/0/1666271404945?e=2147483647&amp;v=beta&amp;t=5NrGnDWlrdXMEhmvt_XMzqrcffL8Js1kFdqdextJWI4" loading="lazy" data-embed-id="cover-image" alt>
    </div>
  </div>
<!---->    </figure>


  <div class="top-card-layout__card relative p-2 papabear:p-details-container-padding">
        
    <div class="top-card__profile-image-container top-card__profile-image-container--cvw-fix
        top-card-layout__entity-image-container flex" data-section="picture">
      
  <img class="artdeco-entity-image artdeco-entity-image--circle-8
       top-card-layout__entity-image top-card__profile-image top-card__profile-image--real-image onload
          top-card-layout__entity-image shadow-color-shadow shadow-[0_4px_12px] border-2 border-solid border-color-surface mt-[-70px] mb-[14px] papabear:border-4 papabear:mt-[-100px] papabear:mb-[18px]" data-delayed-url="https://media.licdn.com/dms/image/D5603AQEgXzNMajwHjQ/profile-displayphoto-shrink_800_800/0/1666268942675?e=2147483647&amp;v=beta&amp;t=yK-DC4Zw0JElJ2xINGZB1uzMuKF1JGcFyaUCDVLcJCI" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Dulitha Wijewantha">

<!---->        </div>
  

      <div class="top-card-layout__entity-info-container flex flex-wrap papabear:flex-nowrap">
        <div class="top-card-layout__entity-info flex-grow flex-shrink-0 basis-0 babybear:flex-none babybear:w-full babybear:flex-none babybear:w-full">
              <h1 class="top-card-layout__title font-sans text-lg papabear:text-xl font-bold leading-open text-color-text mb-0">
                Dulitha Wijewantha
                
<!----><!---->      
              </h1>
            <h2 class="top-card-layout__headline break-words font-sans text-md leading-open text-color-text">
                Building businesses on the Internet | AI/ ML Experimenter 🔬 | Web3 Degen 🧪 |  Co-Founder @ Aristotle 🧠 | Helping Founders setup &amp; scale tech teams 🧑🏼‍💻 CA(Co-Founder)
            </h2>

            <h3 class="top-card-layout__first-subline font-sans text-md leading-open text-color-text-low-emphasis">
              
      




  <div class="top-card__subline-item">Singapore</div><span class="top-card__subline-item">
    6K followers
  </span><span class="top-card__subline-item top-card__subline-item--bullet">500+ connections</span>

          
            </h3>

<!---->
          <div class="top-card-layout__cta-container flex flex-wrap mt-0.5 papabear:mt-0 ml-[-12px]">
                <a class="top-card-layout__cta mt-2 ml-1.5 h-auto babybear:flex-auto top-card-layout__cta--primary btn-md btn-primary" href="https://www.linkedin.com/signup/public-profile-join?vieweeVanityName=dulithawijewantha&amp;trk=public_profile_top-card-primary-button-join-to-follow" data-tracking-control-name="public_profile_top-card-primary-button-join-to-follow" data-tracking-will-navigate>
                  Join to follow
                </a>
              
<!---->              </div>
        </div>

            <div class="top-card-layout__entity-info flex-grow flex-shrink-0 basis-0 babybear:flex-none babybear:w-full
                top-card-layout__entity-info--right-column ml-details-container-padding max-w-[288px] babybear:my-2 babybear:ml-0">
              
      <div class="top-card__links-container">
          <div data-section="currentPositionsDetails" class="top-card__right-column-link top-card__position-info with-transition">
            
  <a class="top-card-link top-card-link--link" href="https://lk.linkedin.com/company/aristotlehq?trk=public_profile_topcard-current-company" target="_self" data-tracking-control-name="public_profile_topcard-current-company" data-tracking-will-navigate>
    


  
  <img class="artdeco-entity-image artdeco-entity-image--square-1
       top-card-link__logo" data-delayed-url="https://media.licdn.com/dms/image/C4D0BAQGVFjXtnh8c2w/company-logo_100_100/0/1677642489216?e=2147483647&amp;v=beta&amp;t=hNB6eofYGQj4R-wYl1PQCt4b8Mvm2XA8To5qhSI7Ecg" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Aristotle - Co-Pilot for Cold Sales">

<span class="top-card-link__description">
  Aristotle - Co-Pilot for Cold Sales<!---->    </span>

  </a>

          </div>
<!---->              <div data-section="educationsDetails" class="top-card__right-column-link top-card__education-info with-transition">
            
  <a class="top-card-link top-card-link--link" href="https://lk.linkedin.com/school/universityofgalway/?trk=public_profile_topcard-school" target="_self" data-tracking-control-name="public_profile_topcard-school" data-tracking-will-navigate>
    


  
  <img class="artdeco-entity-image artdeco-entity-image--square-1
       top-card-link__logo" data-delayed-url="https://media.licdn.com/dms/image/C4E0BAQFqUYdjt_BOxw/company-logo_100_100/0/1662029031608?e=2147483647&amp;v=beta&amp;t=Tq3J6Ixi1HlsH8yNMPmu8cwpQ_iU2aKj005JCnpStNc" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" alt="National University of Ireland, Galway">

<span class="top-card-link__description">
  National University of Ireland, Galway<!---->    </span>

  </a>

          </div>
          <div data-section="websites" class="top-card__right-column-link top-card__websites with-transition">
            


    


<div class>
    <button class="modal__outlet " data-tracking-control-name="public_profile_websites-modal-outlet" data-modal="default-outlet">
      
        
  <div class="top-card-link websites">
    


  <img data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9o8qqup6da04vhqijz8ft1j5g" class="top-card-link__logo top-card-link__logo--link-icon artdeco-entity-image artdeco-entity-image--square-1" alt="Websites" aria-hidden="true">
<span class="top-card-link__description">
  Websites<!---->    </span>

  </div>

      
    </button>

  <div id="websites" class="modal " data-outlet="default-outlet">
<!---->        <div class="modal__overlay flex items-center bg-color-background-scrim justify-center fixed bottom-0 left-0 right-0 top-0 opacity-0 invisible pointer-events-none z-[1000] transition-[opacity] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.17s]
        py-4
        ">
      <section aria-modal="true" role="dialog" aria-labelledby="websites-modal-header" tabindex="-1" class="max-h-full modal__wrapper overflow-auto p-0 bg-color-surface max-w-[1128px] min-h-[160px] relative scale-[0.25] shadow-sm shadow-color-border-faint transition-[transform] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.33s] focus:outline-0 rounded-md
          
          w-[1128px] mamabear:w-[744px] babybear:w-[360px]
          
          ">
          <header class="modal__header flex items-center justify-between border-b-1 border-solid border-color-border-faint py-1.5 px-3
              ">
              <h2 id="websites-modal-header" class="modal__title font-normal leading-open text-color-text text-lg">Websites</h2>
              <button class="modal__dismiss modal__dismiss--with-icon btn-tertiary h-[40px] w-[40px] p-0 rounded-full indent-0
                  " aria-label="Dismiss" data-tracking-control-name="public_profile_websites-modal-dismiss" type="button">
                  <icon class="modal__dismiss-icon relative top-[2px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/gs508lg3t2o81tq7pmcgn6m2"></icon>
              </button>
<!---->              </header>
        <main class="modal__main w-full ">
          
        


<dl class="websites__list">
    <div class="websites__list-row">
      <dt class="websites__list-item websites__name">Blog</dt>
      <dd class="websites__list-item websites__url">
        <a href="https://www.linkedin.com/redir/redirect?url=http%3A%2F%2Fdulitha%2Eme&amp;urlhash=BA0j&amp;trk=public_profile_website" target="_blank" data-tracking-control-name="public_profile_website" data-tracking-will-navigate>
          <span class="websites__url-text">
            http://dulitha.me</span><img alt="External link" aria-hidden="true" class="websites__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy">
        </a>
      </dd>
    </div>
    <div class="websites__list-row">
      <dt class="websites__list-item websites__name">Company Website</dt>
      <dd class="websites__list-item websites__url">
        <a href="https://www.linkedin.com/redir/redirect?url=http%3A%2F%2Fwso2%2Ecom%2F&amp;urlhash=Fgjx&amp;trk=public_profile_website" target="_blank" data-tracking-control-name="public_profile_website" data-tracking-will-navigate>
          <span class="websites__url-text">
            http://wso2.com/</span><img alt="External link" aria-hidden="true" class="websites__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy">
        </a>
      </dd>
    </div>
    <div class="websites__list-row">
      <dt class="websites__list-item websites__name">Other:</dt>
      <dd class="websites__list-item websites__url">
        <a href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fgithub%2Ecom%2Fdulichan%2F&amp;urlhash=PoAI&amp;trk=public_profile_website" target="_blank" data-tracking-control-name="public_profile_website" data-tracking-will-navigate>
          <span class="websites__url-text">
            https://github.com/dulichan/</span><img alt="External link" aria-hidden="true" class="websites__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy">
        </a>
      </dd>
    </div>
</dl>

      
        </main>

<!---->          </section>
    </div>
  </div>
</div>


          </div>
      </div>
  
            </div>
      </div>

      















  <div class="ellipsis-menu absolute right-0 top-0 top-card-layout__ellipsis-menu mr-1 papabear:mt-0.5 papabear:mr-2">
    



<div class="collapsible-dropdown flex items-center relative hyphens-auto">
      
        <button class="ellipsis-menu__trigger
            collapsible-dropdown__button btn-md btn-tertiary cursor-pointer
            !py-[6px] !px-1 flex items-center rounded-[50%]
            
            " aria-expanded="false" aria-label="Open menu" data-tracking-control-name="public_profile_ellipsis-menu-trigger">
          <icon class="ellipsis-menu__trigger-icon m-0 p-0 centered-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/671xosfpvk4c0kqtyl87hashi"></icon>
        </button>
      

    <ul class="collapsible-dropdown__list hidden container-raised absolute w-auto overflow-y-auto flex-col items-stretch z-1 bottom-auto top-[100%]" role="menu" tabindex="-1">
      
          

            <li class="ellipsis-menu__item border-t-1 border-solid border-color-border-low-emphasis first-of-type:border-none flex">
              








<a href="https://www.linkedin.com/uas/login?fromSignIn=true&amp;session_redirect=https%3A%2F%2Fsg.linkedin.com%2Fin%2Fdulithawijewantha&amp;trk=public_profile_ellipsis-menu-semaphore-sign-in-redirect" data-tracking-control-name="public_profile_ellipsis-menu-semaphore-sign-in-redirect" data-tracking-will-navigate data-item-type="semaphore" data-semaphore-content-type="PROFILE" data-semaphore-content-urn="urn:li:nonIterableMember:ADoAAAXnsV8BIvB3AsRwoDqtIYYiP_S9gElSYNo" data-semaphore-tracking-prefix="public_profile_ellipsis-menu-semaphore" data-is-logged-in="false" data-modal="semaphore__toggle" class="semaphore__toggle visited:text-color-text-secondary ellipsis-menu__semaphore ellipsis-menu__item-button flex items-center w-full p-1 cursor-pointer font-sans text-sm font-bold link-styled focus:link-styled link:no-underline active:bg-color-background-container-tint focus:bg-color-background-container-tint hover:bg-color-background-container-tint outline-offset-[-2px]">
<!---->        
                  <icon class="ellipsis-menu__item-icon text-color-text h-[24px] w-[24px] mr-1" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/iq0x9q37wj214o129ai1yjut">
                  </icon>
                  Report this profile
                
</a>









<div class="hidden">
    <button class="modal__outlet " data-tracking-control-name="public_profile_ellipsis-menu-semaphore-modal_modal_outlet" data-modal="default-outlet">
      
    </button>

  <div id="semaphore-modal" class="modal semaphore-modal max-w-[744px] " data-outlet="default-outlet">
<!---->        <div class="modal__overlay flex items-center bg-color-background-scrim justify-center fixed bottom-0 left-0 right-0 top-0 opacity-0 invisible pointer-events-none z-[1000] transition-[opacity] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.17s]
        py-4
        ">
      <section aria-modal="true" role="dialog" aria-labelledby="semaphore-modal-modal-header" tabindex="-1" class="max-h-full modal__wrapper overflow-auto p-0 bg-color-surface max-w-[1128px] min-h-[160px] relative scale-[0.25] shadow-sm shadow-color-border-faint transition-[transform] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.33s] focus:outline-0 rounded-md
           modal__wrapper--with-footer flex flex-col
          w-[1128px] mamabear:w-[744px] babybear:w-[360px]
           max-w-[min(744px,100%-24px)]
          ">
          <header class="modal__header flex items-center justify-between border-b-1 border-solid border-color-border-faint py-1.5 px-3
              ">
              <h2 id="semaphore-modal-modal-header" class="modal__title font-normal leading-open text-color-text text-lg">Report</h2>
              <button class="modal__dismiss modal__dismiss--with-icon btn-tertiary h-[40px] w-[40px] p-0 rounded-full indent-0
                  " aria-label="Dismiss" data-tracking-control-name="public_profile_ellipsis-menu-semaphore-modal_modal_dismiss" type="button">
                  <icon class="modal__dismiss-icon relative top-[2px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/gs508lg3t2o81tq7pmcgn6m2"></icon>
              </button>
<!---->              </header>
        <main class="modal__main w-full flex-1">
          
    <h2 class="semaphore-modal__title text-md font-medium mb-1 ml-2 mt-2 text-color-text">
      Report<!-- semaphore title goes here -->
    </h2>
    <div class="semaphore-modal__content text-color-text"></div>
  
        </main>

            <footer class="modal__footer flex justify-end py-1.5 px-3 border-t-1 border-solid border-color-border-faint">
              
    <button class="btn-md btn-secondary" data-semaphore-action="back" data-tracking-control-name="semaphore-back">Back</button>
    <button class="btn-md btn-primary ml-1" data-semaphore-action="submit" data-tracking-control-name="semaphore-submit" disabled="true">Submit</button>
  
            </footer>
      </section>
    </div>
  </div>
</div>



<template id="semaphore-container-template">
  <ul class="semaphore-options-container mb-2">
    <!-- list of semaphore options -->
  </ul>
</template>


<template id="semaphore-block-template">
  <li class="px-2 py-1" data-semaphore-item="action">
    <span class="text-sm text-color-text-low-emphasis whitespace-pre-line" data-attr="block-content"></span>
    <input class="hidden scale-150" data-tracking-control-name="public_profile_ellipsis-menu-semaphore" name="semaphore-action" checked value data-semaphore-input type="radio">
  </li>
</template>


<template id="semaphore-section-template">
  <li class="px-2 py-1" data-semaphore-item="section">
    <button class="w-full text-color-text" data-tracking-control-name="public_profile_ellipsis-menu-semaphore" data-semaphore-input>
      <span class="text-md text-left inline-block w-[calc(100%-24px)]" data-attr="title"></span>
      <icon class="float-right w-[24px] h-[24px] opacity-60" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/bib7g6ntpj66fbkg8zzh0psp2"></icon>
    </button>
  </li>
</template>


<template id="semaphore-openpage-template">
  <li class="px-2 py-1 border-t-1 border-solid border-color-border-faint" data-semaphore-item="openpage">
    <span class="text-md font-medium block my-1" data-attr="body"></span>
    <button data-tracking-control-name="public_profile_ellipsis-menu-semaphore" data-semaphore-input>
      <span class="text-md text-color-text" data-attr="title"></span>
    </button>
  </li>
</template>


<template id="semaphore-action-template">
  <li class="px-2 py-1" data-semaphore-item="action" data-semaphore-type>
    <span class="text-md font-medium inline-block my-1" data-attr="body"></span>
    <button class="w-full text-color-text" data-tracking-control-name="public_profile_ellipsis-menu-semaphore" data-semaphore-input>
      <span class="text-md text-left inline-block w-[calc(100%-24px)]" data-attr="title"></span>
      <icon class="float-right w-[24px] h-[24px] opacity-60" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/bib7g6ntpj66fbkg8zzh0psp2"></icon>
    </button>
  </li>
</template>


<template id="semaphore-action-radio-template">
  <li class="px-2 py-1" data-semaphore-item="action">
    <label>
      <div class="flex">
        <input class="scale-150" data-tracking-control-name="public_profile_ellipsis-menu-semaphore" name="semaphore-action" value data-semaphore-input type="radio">
        <span class="text-md inline-block ml-1" data-attr="title"></span>
      </div>

      <span class="text-sm text-left inline-block w-[calc(100%-24px)] opacity-60 pl-[30px]" data-attr="body"></span>
    </label>
  </li>
</template>


<template id="semaphore-openlink-template">
  <li class="px-2 py-1" data-semaphore-item="openlink">
    <a class="text-color-text hover:no-underline visited:text-color-text" data-semaphore-input data-tracking-control-name="public_profile_ellipsis-menu-semaphore" href target="_blank" data-tracking-will-navigate>
      <span class="text-md text-color-text font-normal inline-block" data-attr="title"></span>
      <span class="text-sm text-color-text font-normal inline-block w-[calc(100%-24px)] opacity-60" data-attr="body"></span>
      <icon class="float-right w-[24px] h-[24px] opacity-60" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/481psuouj1lu3q2laho6vqwhn"></icon>
    </a>
  </li>
</template>


<template id="semaphore-result-template">
  <p class="semaphore-options-container__item pl-2 pb-2" data-semaphore-item="result">
    <span class="text-sm font-normal text-color-text-secondary" data-attr="thanks-text-body"></span>
    <a class="text-sm font-semibold text-color-link" href="https://www.linkedin.com/help/linkedin/answer/37822" target="_blank" data-attr="thanks-help-center-link" data-tracking-control-name="public_profile_ellipsis-menu-semaphore-help-center" data-tracking-will-navigate data-semaphore-input></a>
  </p>
</template>


            </li>
<!---->          
    </ul>

<!---->    </div>


  </div>


      <div class="top-card-layout__footer mt-2">
        
<!---->            









<section class="slide-list slide-list--no-overflow relative  open-to-opportunities" data-no-more-previous-content-alert="No more previous content" data-no-more-next-content-alert="No more next content">
  <header class="slide-list__header mb-1.5">
<!---->        <div class="slide-list__a11y-notification sr-only" role="alert" aria-live="assertive"></div>
  </header>

    <div class="slide-list__nav">
      <div class="slide-list__nav-wrap absolute flex h-full items-center top-0 z-1 slide-list__nav-wrap--prev left-[-20px]">
        <button data-tracking-control-name="public_profile_slide_list_prev_button" class="slide-list__nav-button btn-sm btn-overlay cursor-pointer disabled:hidden" aria-label="Previous Slide" data-direction="prev" disabled>
          <icon class="slide-list__nav-icon flex items-center justify-center pointer-events-none h-3 rtl:-scale-x-100 rtl:translate-x-[7px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/e5ka7p8s9n5r0z9p6kpmm3hig"></icon>
        </button>
      </div>
    </div>

    <div class="relative overflow-hidden">
          <ul class="slide-list__list slide-list__list--no-overflow items-stretch flex list-none transition-all duration-slow ease-standard ">
            
      <li class="open-to-opportunities__item min-w-[357px] slide-list__item mr-2 rtl:ml-2">
        





<div class="open-to-card flex min-h-[116px] flex-col p-1.5 container-lined h-full">
  <h3 class="open-to-card__title mb-0.5 text-ellipsis overflow-hidden font-sans font-semibold text-md line-clamp-2">
    Contact Dulitha for services
  </h3>
  <h4 class="open-to-card__subtitle grow text-ellipsis overflow-hidden mb-1.5 font-sans text-sm text-color-text-secondary line-clamp-2">
    Custom Software Development, Mobile Application Development, IT Consulting, Application Development, and SaaS Development
  </h4>
  <div class="open-to-card__cta">
    
    <button class="service-provider-card__modal-outlet" data-modal="service-provider-modal-outlet" data-tracking-control-name="public_profile_service-provider-info-modal-outlet" id="service-provider-modal-outlet">
      See all details
    </button>
  
  </div>
</div>


      </li>
<!---->      
          </ul>
    </div>

    <div class="slide-list__nav">
      <div class="slide-list__nav-wrap absolute flex h-full items-center top-0 z-1 slide-list__nav-wrap--next right-[-20px]">
        <button data-tracking-control-name="public_profile_slide_list_next_button" class="slide-list__nav-button btn-sm btn-overlay cursor-pointer disabled:hidden" aria-label="Next Slide" data-direction="next">
          <icon class="slide-list__nav-icon flex items-center justify-center pointer-events-none h-3 rtl:-scale-x-100 rtl:translate-x-[7px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/c9dcz2pyrbwi3sr6xwxigmvlz"></icon>
        </button>
      </div>
    </div>

<!---->    </section>


  














<div class>
<!---->
  <div id="service-provider-modal" class="modal " data-outlet="service-provider-modal-outlet">
<!---->        <div class="modal__overlay flex items-center bg-color-background-scrim justify-center fixed bottom-0 left-0 right-0 top-0 opacity-0 invisible pointer-events-none z-[1000] transition-[opacity] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.17s]
        py-4
        ">
      <section aria-modal="true" role="dialog" aria-labelledby="service-provider-modal-modal-header" tabindex="-1" class="max-h-full modal__wrapper overflow-auto p-0 bg-color-surface max-w-[1128px] min-h-[160px] relative scale-[0.25] shadow-sm shadow-color-border-faint transition-[transform] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.33s] focus:outline-0 rounded-md
          
          w-[1128px] mamabear:w-[744px] babybear:w-[360px]
          
          ">
          <header class="modal__header flex items-center justify-between border-b-1 border-solid border-color-border-faint py-1.5 px-3
              ">
              <h2 id="service-provider-modal-modal-header" class="modal__title font-normal leading-open text-color-text text-lg">Business Info</h2>
              <button class="modal__dismiss modal__dismiss--with-icon btn-tertiary h-[40px] w-[40px] p-0 rounded-full indent-0
                  " aria-label="Dismiss" data-tracking-control-name="public_profile_service-provider-info-modal-dismiss" type="button">
                  <icon class="modal__dismiss-icon relative top-[2px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/gs508lg3t2o81tq7pmcgn6m2"></icon>
              </button>
<!---->              </header>
        <main class="modal__main w-full ">
          
    <dl>
      <div class="service-provider-info-modal__section">
        <dt class="service-provider-info-modal__section-title">Services offered</dt>
        <dd>
          <ul class="service-provider-info-modal__service-skill-list">
              <li class="service-provider-info-modal__service-skill">Custom Software Development</li>
              <li class="service-provider-info-modal__service-skill">Mobile Application Development</li>
              <li class="service-provider-info-modal__service-skill">IT Consulting</li>
              <li class="service-provider-info-modal__service-skill">Application Development</li>
              <li class="service-provider-info-modal__service-skill">SaaS Development</li>
          </ul>
        </dd>
      </div>
<!---->          <div class="service-provider-info-modal__section">
        <dt class="service-provider-info-modal__section-title">Work preference</dt>
        <dd>
            In person or remote
        </dd>
      </div>
        <div class="service-provider-info-modal__section">
          <dt class="service-provider-info-modal__section-title">Receive free inquiries</dt>
          <dd>
            I accept direct messages and business inquiries by anyone on LinkedIn for free, even if we’re not connected. 
            <a href="/help/linkedin/answer/139?trk=public_profile_service-provider-info-modal-learn-more" data-tracking-control-name="public_profile_service-provider-info-modal-learn-more" target="_blank" rel="nofollow" data-tracking-will-navigate>
              Learn more
            </a>
          </dd>
        </div>
    </dl>
  
        </main>

<!---->          </section>
    </div>
  </div>
</div>



  
      </div>
  </div>
</section>



<!---->
<!---->
<!---->
      



  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section summary" data-section="summary">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
    About
  
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <p>Hi!🙋🏾‍♂️<br><br>I am a problem solver, who is in the business of helping startups and enterprises solve their business challenges, fix ineffective business processes and increase revenue 💹; via digitization . <br><br>In order to help organizations realize their digital goal, I co-founded CabbageApps, as a technology partner. Half a decade has passed since its launch and the company has developed and delivered #Tech products for clients acquiring over a million users 📈.<br><br>I bring with me 10+ years of experience, varying from the development of an open-source product, working with fortune 500 companies, to assisting customers with their technology buying process and developing a custom solutions to customers all over the world 🌍 .<br><br>🙋🏾‍♂️ Talk to me about: <br><br>⚡️Fintech<br>⚡️Product Development<br>⚡️UI/UX<br>⚡️JavaScript<br>⚡️Psychology <br>⚡️Machine Learning.<br></p>
  
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!----><!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      











  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section activities" data-section="posts">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
    Articles by Dulitha
  
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul>
        <li class="activities-section__item--articles">
            








  <a href="https://www.linkedin.com/pulse/working-business-vs-dulitha-wijewantha?trk=public_profile_article_view" target="_self" data-tracking-control-name="public_profile_article_view" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-article-card">
    

<!---->
  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img data-delayed-url="https://media.licdn.com/dms/image/C5612AQGinAeCIGljhA/article-cover_image-shrink_180_320/0/1628068221393?e=2147483647&amp;v=beta&amp;t=48Gliw4x3qVutJuL1kMBxozo5YdK1YMkBREZ9QtSSN8" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    Working ON the business vs IN the business
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
      By Dulitha Wijewantha
  
        </h4>

<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
      <span class="body-text text-color-text-low-emphasis base-main-card__metadata-item">Aug 4, 2021</span>
<!---->      
          </div>
    </div>

<!---->      

  </a>





        </li>
        <li class="activities-section__item--articles">
            








  <a href="https://www.linkedin.com/pulse/change-scenery-stimulate-thebrain-dulitha-wijewantha?trk=public_profile_article_view" target="_self" data-tracking-control-name="public_profile_article_view" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-article-card">
    

<!---->
  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img data-delayed-url="https://media.licdn.com/dms/image/C5112AQF3inYv1gZgsg/article-cover_image-shrink_180_320/0/1575853062822?e=2147483647&amp;v=beta&amp;t=cHu4_T-YxxVpMktP6wF6zG3O0btc9M5cjf8MJcSzyVo" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    A change in scenery to stimulate the brain
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
      By Dulitha Wijewantha
  
        </h4>

<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
      <span class="body-text text-color-text-low-emphasis base-main-card__metadata-item">Dec 9, 2019</span>
<!---->      
          </div>
    </div>

<!---->      

  </a>





        </li>
        <li class="activities-section__item--articles">
            








  <a href="https://www.linkedin.com/pulse/describe-your-ideas-spec-dulitha-wijewantha?trk=public_profile_article_view" target="_self" data-tracking-control-name="public_profile_article_view" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-article-card">
    

<!---->
  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img data-delayed-url="https://media.licdn.com/dms/image/C4D12AQG1M55s_TQloQ/article-cover_image-shrink_180_320/0/1520227157478?e=2147483647&amp;v=beta&amp;t=gXdu_lEHcofIEyh1Gcjyqo8UWqd_oqUjtQZ5lhRLHDQ" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    Describe your ideas in a Spec
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
      By Dulitha Wijewantha
  
        </h4>

<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
      <span class="body-text text-color-text-low-emphasis base-main-card__metadata-item">Mar 5, 2018</span>
<!---->      
          </div>
    </div>

<!---->      

  </a>





        </li>
    </ul>

<!---->      
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!----><!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      











  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section activities" data-section="posts">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
    Activity
  
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul>
        <li class="activities-section__item--posts">
            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/codyfwest_sql-dataanalysis-dataanalyst-activity-7054106315861721088-EoRn?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      Mind maps are helpful for learning SQL.

They allow you to visually organize concepts in your mind.

Organization = faster learning.

Shoutout to Dr.…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D5622AQFizNPOTJeqzg/feedshare-shrink_800/0/1681505304630?e=2147483647&amp;v=beta&amp;t=9IVaVD5x7MxCjFjwLnHdm41cPMEmgemOZeao-bF69P4" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      Mind maps are helpful for learning SQL.

They allow you to visually organize concepts in your mind.

Organization = faster learning.

Shoutout to Dr.…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





        </li>
        <li class="activities-section__item--posts">
            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/david-pervan_investment-opportunity-ecovillage-activity-7053519311918768128-CMsE?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      Investment opportunity alert! a few years ago I became a co-founder, first homebuyer &amp; investor of YokoVillage. It's been an incredible journey so…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D4E22AQFP3d13S-d79A/feedshare-shrink_800/0/1681690051232?e=2147483647&amp;v=beta&amp;t=PBR4-qqGn_qcQEoIxGYwQwK22D_GFp3GD-6GtIi1s3c" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      Investment opportunity alert! a few years ago I became a co-founder, first homebuyer &amp; investor of YokoVillage. It's been an incredible journey so…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





        </li>
        <li class="activities-section__item--posts">
            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/justinwelsh_ideas-are-a-dime-a-dozen-everyone-has-them-activity-7053339758260809728-LApR?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      Ideas are a dime a dozen - everyone has them. 

Execution is a bit more rare. Moving from idea to action. 

Action over 5 years? 10 years? 20…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D4E22AQHWzp33frweYA/feedshare-shrink_2048_1536/0/1681647242851?e=2147483647&amp;v=beta&amp;t=XJw45MNNh8VKp_wjgVdjnjU-TAnSsq5L_wJo1X3vA18" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      Ideas are a dime a dozen - everyone has them. 

Execution is a bit more rare. Moving from idea to action. 

Action over 5 years? 10 years? 20…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





        </li>
    </ul>

      <a class="activities-section__button" href="https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Flk%2Elinkedin%2Ecom%2Fin%2Fdulithawijewantha%2Frecent-activity%2F&amp;trk=public_profile_see-all-posts" data-tracking-control-name="public_profile_see-all-posts" data-tracking-will-navigate>
        Join now to see all activity
      </a>
          
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!----><!---->
      




  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section experience">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
    Experience
  
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul class="experience__list">
          







<li class="profile-section-card  experience-item" data-section="currentPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/aristotlehq?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C4D0BAQGVFjXtnh8c2w/company-logo_100_100/0/1677642489216?e=2147483647&amp;v=beta&amp;t=hNB6eofYGQj4R-wYl1PQCt4b8Mvm2XA8To5qhSI7Ecg" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Aristotle - Co-Pilot for Cold Sales Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
     Co-Founder &amp; CTO
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/aristotlehq?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    Aristotle - Co-Pilot for Cold Sales
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Mar 2023</time> - Present<span class="date-range__duration">2 months</span>
  </span>

      </p>

      <p class="experience-item__location experience-item__meta-item">
        San Francisco, California, United States
      </p>

      <div class="experience-item__description experience-item__meta-item" data-section="currentPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    We help B2B SaaS startups establish a repeatable sales process through founder-led sales. Funding was raised from HustleFund, Incisive Ventures, Unpopular Ventures, and Geek Ventures.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


          







<li class="profile-section-card  experience-item" data-section="currentPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/cabbageapps?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQGLS5aKEMN-Aw/company-logo_100_100/0/1631094305931?e=2147483647&amp;v=beta&amp;t=VceA_tCh6YRBvBf95OD0BKNr5Jk6-gf7M9b9zRX4p1c" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="CabbageApps Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Co-Founder
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/cabbageapps?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    CabbageApps
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Jan 2017</time> - Present<span class="date-range__duration">6 years 4 months</span>
  </span>

      </p>

      <p class="experience-item__location experience-item__meta-item">
        Colombo, Sri Lanka
      </p>

      <div class="experience-item__description experience-item__meta-item" data-section="currentPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    A startup focused on being a technology partner for other startups, scale ups and enterprises. We give startups aid in holistic product development; scale-ups aid in setting up a team of engineers and designers; and enterprises the advantage of Startup Thinking 💡 and Speed 💨 . <br><br>Starting from just a team of 5, CabbageApps currently has a team of 30 and has plans to make it 200 within the next two years.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


          







<li class="profile-section-card  experience-item" data-section="currentPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/hyperglade?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQFhf21WWuXNDA/company-logo_100_100/0/1643024541335?e=2147483647&amp;v=beta&amp;t=6SksWMbPOhVGPG2CNEZSKvWnr5oA_Aj4IiuBtxnhmR0" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Hyperglade Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Co-Founder
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/hyperglade?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    Hyperglade
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Jun 2021</time> - Present<span class="date-range__duration">1 year 11 months</span>
  </span>

      </p>

      <p class="experience-item__location experience-item__meta-item">
        Singapore
      </p>

      <div class="experience-item__description experience-item__meta-item" data-section="currentPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Sphere heading Blockchain development and conceptualizing of Product Concepts.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


          







<li class="profile-section-card  experience-item" data-section="currentPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/urban.lk?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQFMYUbudC_bfA/company-logo_100_100/0/1566461564147?e=2147483647&amp;v=beta&amp;t=Kw3CNnyo1UtMxVoOuCdftXwNFNxkBoGbGL2nqI5bgQ8" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Urban.lk Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Board Member
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/urban.lk?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    Urban.lk
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Mar 2020</time> - Present<span class="date-range__duration">3 years 2 months</span>
  </span>

      </p>

      <p class="experience-item__location experience-item__meta-item">
        Colombo, Western, Sri Lanka
      </p>

      <div class="experience-item__description experience-item__meta-item" data-section="currentPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Helping Urban.lk Founders in the capacity of Board Member providing Technology / Marketing Direction.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


          







<li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/hustle-fund?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C4D0BAQGbiyStzEqXaw/company-logo_100_100/0/1669921776913?e=2147483647&amp;v=beta&amp;t=teVCRAB6jWuqgZYlVkley9MPDYnyeKnD35wiGehx12Y" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Hustle Fund Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    EIR
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/hustle-fund?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    Hustle Fund
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Oct 2022</time> - <time>Mar 2023</time><span class="date-range__duration">6 months</span>
  </span>

      </p>

      <p class="experience-item__location experience-item__meta-item">
        California, United States
      </p>

      <div class="experience-item__description experience-item__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Building new initiatives and spinning up new business ideas.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


          







<li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/carbon-planter?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQGG50sKwYFmbA/company-logo_100_100/0/1659502892968?e=2147483647&amp;v=beta&amp;t=uwKN5IjZpsJe5rXjGPES3_fAV5g-kfiRp3P06INaF64" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Carbon Planter Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Co-Founder
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/carbon-planter?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    Carbon Planter
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Apr 2020</time> - <time>Oct 2022</time><span class="date-range__duration">2 years 7 months</span>
  </span>

      </p>

      <p class="experience-item__location experience-item__meta-item">
        Colombo, Western Province, Sri Lanka
      </p>

      <div class="experience-item__description experience-item__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Carbon Planter helps Businesses to gift Digital Trees for Event Attendees of Online and Offline events. The digital trees are backed by natural value of trees where we work with Tree Planters to help them bridge the supply and demand gap.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


          







<li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/getalakazam?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C510BAQGlXWZ4OyQf7Q/company-logo_100_100/0/1567567526482?e=2147483647&amp;v=beta&amp;t=_ILJzYXlAz4bEs_cDEzY2M0gnCbGu2m5F9NN14RktEM" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="alakazam Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    CEO
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/getalakazam?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    alakazam
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Jul 2017</time> - <time>Jan 2020</time><span class="date-range__duration">2 years 7 months</span>
  </span>

      </p>

      <p class="experience-item__location experience-item__meta-item">
        Colombo, Sri Lanka
      </p>

      <div class="experience-item__description experience-item__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    A product focused on building an AI based Assistant for Social Media, with a focus on  the SMEs and Influencer markets. The product got featured in Tech in Asia and was exhibited in Rise Conference in Hong Kong 2018. <br><br>It raised capital from Third Lane Ventures, a Micro-VC based in Sri Lanka and also raised Capital from Singapore and established the business there. Alakazam also participated in the AI/ Blockchain Accelerator in Taiwan conducted by AppWorks.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


          
<li class="experience-group experience-item" data-numcurrent="0" data-numpast="2">

  
  <a class="experience-group-header__url" data-tracking-control-name="public_profile_experience-group-header" data-tracking-will-navigate href="https://lk.linkedin.com/company/wso2?trk=public_profile_experience-group-header" title="WSO2">

    


<div class="experience-group-header">
  <div class="experience-group-header__image-container">
    
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       experience-group-header__image" data-delayed-url="https://media.licdn.com/dms/image/C4D0BAQFchI_Xw-FFhQ/company-logo_100_100/0/1597299923263?e=2147483647&amp;v=beta&amp;t=LvBUpTOugPMYV99dqZXSXKt8GQwkqkBGyn3IVoGCcv4" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="WSO2">

  </div>

  <div class="experience-group-header__content">
    <h4 class="experience-group-header__company">
      WSO2
    </h4>

      <p class="experience-group-header__duration">
        4 years
      </p>
  </div>
</div>

  </a>


  <ul class="experience-group__positions">
      







<li class="profile-section-card  experience-group-position" data-section="pastPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/wso2?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C4D0BAQFchI_Xw-FFhQ/company-logo_100_100/0/1597299923263?e=2147483647&amp;v=beta&amp;t=LvBUpTOugPMYV99dqZXSXKt8GQwkqkBGyn3IVoGCcv4" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="WSO2 Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Senior Software Engineer
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/wso2?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    WSO2
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-group-position__duration experience-group-position__meta-item">
        



  <span class="date-range">
<time>Apr 2015</time> - <time>Mar 2017</time><span class="date-range__duration">2 years</span>
  </span>

      </p>

      <p class="experience-group-position__location experience-group-position__meta-item">
        Colombo
      </p>

      <div class="experience-group-position__description experience-group-position__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    A four year career (2013-2017) as a Software Engineer at one of Sri Lanka's biggest open-source technology providers. <br><br>Handled both the US 🇺🇲and Australian🇭🇲 markets, and made my transition from Engineering to Marketing and Sales.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


      







<li class="profile-section-card  experience-group-position" data-section="pastPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/wso2?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C4D0BAQFchI_Xw-FFhQ/company-logo_100_100/0/1597299923263?e=2147483647&amp;v=beta&amp;t=LvBUpTOugPMYV99dqZXSXKt8GQwkqkBGyn3IVoGCcv4" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="WSO2 Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Software Engineer
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/wso2?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    WSO2
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-group-position__duration experience-group-position__meta-item">
        



  <span class="date-range">
<time>Apr 2013</time> - <time>Apr 2015</time><span class="date-range__duration">2 years 1 month</span>
  </span>

      </p>

      <p class="experience-group-position__location experience-group-position__meta-item">
        Colombo
      </p>

      <div class="experience-group-position__description experience-group-position__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Building the next generation Mobile Device Management console.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


  </ul>
</li>

          







<li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/dsi-samson-group---sri-lanka?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C4E0BAQEm-5MTyUzEtA/company-logo_100_100/0/1538377440588?e=2147483647&amp;v=beta&amp;t=Ha_IIksMpa0iCo7k36bliK16v5rmS2jMlDLKN-m0ObQ" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="DSI Samson Group - Sri Lanka Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Software Engineer
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/dsi-samson-group---sri-lanka?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    DSI Samson Group - Sri Lanka
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Mar 2012</time> - <time>Apr 2013</time><span class="date-range__duration">1 year 2 months</span>
  </span>

      </p>

      <p class="experience-item__location experience-item__meta-item">
        Slave Island, Sri Lanka
      </p>

      <div class="experience-item__description experience-item__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Design and Development of the new Point of Sales system<br>Game Changer application for Order Management<br>TrackIT application for Ticket Processing<br>Anton Inventory Management System
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


          
<li class="experience-group experience-item" data-numcurrent="0" data-numpast="3">

  
  <a class="experience-group-header__url" data-tracking-control-name="public_profile_experience-group-header" data-tracking-will-navigate href="https://lk.linkedin.com/company/azbow?trk=public_profile_experience-group-header" title="Azbow">

    


<div class="experience-group-header">
  <div class="experience-group-header__image-container">
    
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost experience-group-header__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Azbow">

  </div>

  <div class="experience-group-header__content">
    <h4 class="experience-group-header__company">
      Azbow
    </h4>

      <p class="experience-group-header__duration">
        9 months
      </p>
  </div>
</div>

  </a>


  <ul class="experience-group__positions">
      







<li class="profile-section-card  experience-group-position" data-section="pastPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/azbow?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Azbow Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Chief Developer of Custom Application Department
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/azbow?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    Azbow
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-group-position__duration experience-group-position__meta-item">
        



  <span class="date-range">
<time>Nov 2011</time> - <time>Mar 2012</time><span class="date-range__duration">5 months</span>
  </span>

      </p>

      <p class="experience-group-position__location experience-group-position__meta-item">
        Sri Lanka
      </p>

      <div class="experience-group-position__description experience-group-position__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Working and Handling  Software Application development for Custom solutions
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


      







<li class="profile-section-card  experience-group-position" data-section="pastPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/azbow?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Azbow Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Software Engineer
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/azbow?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    Azbow
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-group-position__duration experience-group-position__meta-item">
        



  <span class="date-range">
<time>Sep 2011</time> - <time>Nov 2011</time><span class="date-range__duration">3 months</span>
  </span>

      </p>

<!---->
      <div class="experience-group-position__description experience-group-position__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Building Custom Applications for Business Automation
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


      







<li class="profile-section-card  experience-group-position" data-section="pastPositionsDetails">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/azbow?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Azbow Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Assistant Software Engineer
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/azbow?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
            
    Azbow
  
          </a>
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-group-position__duration experience-group-position__meta-item">
        



  <span class="date-range">
<time>Jul 2011</time> - <time>Sep 2011</time><span class="date-range__duration">3 months</span>
  </span>

      </p>

      <p class="experience-group-position__location experience-group-position__meta-item">
        Sri Lanka
      </p>

      <div class="experience-group-position__description experience-group-position__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Building Java SE applications to different business sectors and building Websites in PHP.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


  </ul>
</li>

          







<li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
<!---->          
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="TechHamlet Graphic" aria-hidden="true">


  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Social Media Marketer
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          
    TechHamlet
  
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Sep 2011</time> - <time>Nov 2011</time><span class="date-range__duration">3 months</span>
  </span>

      </p>

<!---->
      <div class="experience-item__description experience-item__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Hitting traffic deadlines and making effective voice in the community of Tech enthusiasts to market TechHamlet.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


          







<li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
<!---->          
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="TechHamlet Graphic" aria-hidden="true">


  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    Blogger
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          
    TechHamlet
  
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Feb 2011</time> - <time>Jul 2011</time><span class="date-range__duration">6 months</span>
  </span>

      </p>

      <p class="experience-item__location experience-item__meta-item">
        Sri Lanka
      </p>

      <div class="experience-item__description experience-item__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Writing awesome tutorials, latest news and tips and tricks for TechHamlet
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


          







<li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
<!---->          
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Dryoid Graphic" aria-hidden="true">


  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
    The Founder and CEO
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          
    Dryoid
  
      </h4>

    

    <div class="profile-section-card__meta">
      
      <p class="experience-item__duration experience-item__meta-item">
        



  <span class="date-range">
<time>Dec 2010</time> - <time>Jul 2011</time><span class="date-range__duration">8 months</span>
  </span>

      </p>

<!---->
      <div class="experience-item__description experience-item__meta-item" data-section="pastPositions">
        
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Standalone application development, Web application development and Mobile application development integrating Java Technology.
<!---->      </p>

<!---->    </div>

      </div>
  
    </div>
  </div>

  
</li>


    </ul>
  
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!----><!---->
<!---->
      



  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section education" data-section="educationsDetails">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
    Education
  
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul class="education__list">
        





<li class="profile-section-card  education__list-item" data-id="147175708">
<!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/school/universityofgalway/?trk=public_profile_school_profile-section-card_image-click" data-tracking-control-name="public_profile_school_profile-section-card_image-click" data-tracking-will-navigate>
        
  <img class="artdeco-entity-image artdeco-entity-image--square-4
       profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C4E0BAQFqUYdjt_BOxw/company-logo_100_100/0/1662029031608?e=2147483647&amp;v=beta&amp;t=Tq3J6Ixi1HlsH8yNMPmu8cwpQ_iU2aKj005JCnpStNc" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" alt="National University of Ireland, Galway Graphic">

      </a>

  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
      <a class="profile-section-card__title-link" href="https://lk.linkedin.com/school/universityofgalway/?trk=public_profile_school" data-tracking-control-name="public_profile_school" data-tracking-will-navigate>
        National University of Ireland, Galway
      </a>
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          
      <span class="education__item education__item--degree-info">Master's degree</span><span class="education__item education__item--degree-info" data-section="educations">Information Technology</span><!---->      
      </h4>

    

    <div class="profile-section-card__meta">
      
    <p class="education__item education__item--duration">
      



  <span class="date-range">
<time>2012</time> - <time>2013</time><!---->      </span>

    </p>

<!---->      
    </div>
  </div>

  
</li>


        





<li class="profile-section-card  education__list-item" data-id="62665747">
<!---->          
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" alt="Institute of Java Technological Studies Graphic" aria-hidden="true">


  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
      Institute of Java Technological Studies
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          
      <span class="education__item education__item--degree-info">BSc. Software Engineering</span><!----><!---->      
      </h4>

    

    <div class="profile-section-card__meta">
      
    <p class="education__item education__item--duration">
      



  <span class="date-range">
<time>2009</time> - <time>2011</time><!---->      </span>

    </p>

<!---->      
    </div>
  </div>

  
</li>


        





<li class="profile-section-card  education__list-item" data-id="62664530">
<!---->          
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" alt="Ananda College Colombo 10 Graphic" aria-hidden="true">


  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
      Ananda College Colombo 10
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          
      <span class="education__item education__item--degree-info">O/L</span><span class="education__item education__item--degree-info" data-section="educations">Information Technology</span><!---->      
      </h4>

    

    <div class="profile-section-card__meta">
      
    <p class="education__item education__item--duration">
      



  <span class="date-range">
<time>2000</time> - <time>2011</time><!---->      </span>

    </p>

      <div class="education__item--details" data-section="educations">
          <p class="education__item education__item--activities-and-societies">
            Activities and Societies: Debating society, Drama Circle,
          </p>
<!---->          </div>
  
    </div>
  </div>

  
</li>


    </ul>
  
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!----><!---->
<!---->
<!---->
<!---->
      



  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section volunteering" data-section="volunteering">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
    Volunteer Experience
  
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul class="volunteering__list">
        


<li class="profile-section-card ">
<!---->          
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Rotract Club of Colombo Graphic" aria-hidden="true">


  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            Member
          
    </h3>

      <h4 class="profile-section-card__subtitle">
          
            Rotract Club of Colombo
          
      </h4>

    

    <div class="profile-section-card__meta">
      
              <p class="volunteering__item volunteering__item--duration">
                



  <span class="date-range">
      <time>
        Dec 2013
      </time>
  </span>

              </p>

              <p class="volunteering__item volunteering__item--cause">
                Social Services
              </p>

              
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    The Rotaract Club of Colombo consists of a group of young professionals committed to personal, professional and community development. Founded on 9th September 1969, the Rotaract Club of Colombo is sponsored by the Rotary Club of Colombo, and was the first to be chartered in Sri Lanka, and among the earliest of Rotaract clubs in the region.
<!---->      </p>

<!---->    </div>

          
    </div>
  </div>

  
</li>

    </ul>
  
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!----><!---->
<!---->
<!---->
      









  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section certifications" data-section="certifications">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
    Licenses & Certifications
  
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul class="certifications__list">
        


<li class="profile-section-card ">
<!---->          
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Oracle Certified Java Web Developer Graphic" aria-hidden="true">


  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
              Oracle Certified Java Web Developer
          
    </h3>

      <h4 class="profile-section-card__subtitle">
          
            Oracle
          
      </h4>

    

    <div class="profile-section-card__meta">
      
              <div class="certifications__date-range">
                <span class="certifications__start-date">
                  Issued <time>Oct 2011</time>
                </span>
<!---->                  </div>

<!---->
<!---->              
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!---->          
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Oracle certified Java programmer Graphic" aria-hidden="true">


  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
              Oracle certified Java programmer
          
    </h3>

      <h4 class="profile-section-card__subtitle">
          
            Oracle
          
      </h4>

    

    <div class="profile-section-card__meta">
      
              <div class="certifications__date-range">
                <span class="certifications__start-date">
                  Issued <time>Sep 2011</time>
                </span>
<!---->                  </div>

<!---->
<!---->              
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!---->          
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Chamber Certified Java Programmer Graphic" aria-hidden="true">


  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
              Chamber Certified Java Programmer
          
    </h3>

      <h4 class="profile-section-card__subtitle">
          
            Chartered Chamber of Java Professionals
          
      </h4>

    

    <div class="profile-section-card__meta">
      
              <div class="certifications__date-range">
                <span class="certifications__start-date">
                  Issued <time>Jul 2010</time>
                </span>
<!---->                  </div>

<!---->
<!---->              
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!---->          
  <img class="artdeco-entity-image artdeco-entity-image--square-4
      artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Java Mobile Edition 1 Mobile Application Developer Certified Professional Exam Graphic" aria-hidden="true">


  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
              Java Mobile Edition 1 Mobile Application Developer Certified Professional Exam
          
    </h3>

      <h4 class="profile-section-card__subtitle">
          
            Oracle
          
      </h4>

    

    <div class="profile-section-card__meta">
      
<!---->
<!---->
<!---->              
    </div>
  </div>

  
</li>

    </ul>
  
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!----><!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      




  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section publications" data-section="publications">
<!---->
      
        <h2 class="core-section-container__title section-title">
          Publications
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul class="publications__list">
        












<li class="profile-section-card  personal-project">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
       ￼￼￼￼￼￼￼Managing Enterprise Mobile Devices and Delivering Enterprise Mobile Applications
  
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
<!---->          <div class="personal-project__contributors-heading">Other authors</div>
      
<ul class="face-pile__list personal-project__contributors">
<li class="face-pile__list-item">
        <a href="https://lk.linkedin.com/in/kasundananjaya?trk=public_profile_publication_contributor-image" class="face-pile__url" title="Kasun Dananjaya Delgolla" data-tracking-control-name="public_profile_publication_contributor-image" data-tracking-will-navigate>
          
  <img class="artdeco-entity-image artdeco-entity-image--circle-3
       face-pile__profile-photo" data-delayed-url="https://media.licdn.com/dms/image/C5603AQHI0vtBE2G_cQ/profile-displayphoto-shrink_100_100/0/1662652754820?e=1687392000&amp;v=beta&amp;t=sEUvN_9vUjbOdCRMQgn9DtidaGsDUKw4MBP4a5y7M-w" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Kasun Dananjaya Delgolla">

        </a>
    </li>    </ul>

<!---->      
    </div>
  </div>

  
</li>


    </ul>
  
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!----><!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      



  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section courses" data-section="courses">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
    Courses
  
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul class="courses__list">
        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            AJD-ES (Advance Java Developer - Enterprise Solutions
          
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            AJD-MS (Advance Java Developer- Mobile Solutions)
          
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            PCJT (Professional Certification in Java Technology)
          
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            Computer Hardware
          
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            Web Designing
          
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            Corporate Finance management
          
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            E-business
          
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            Management Support Systems
          
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            Strategic Business management
          
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            Strategic IT management
          
    </h3>

      <h4 class="profile-section-card__subtitle">-</h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

    </ul>
  
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!----><!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      



  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section projects" data-section="projects">
<!---->
      
        <h2 class="core-section-container__title section-title">
          Projects
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul class="projects__list">
        












<li class="profile-section-card  personal-project">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fgithub%2Ecom%2Fdulichan%2Fiot-ref-arch&amp;urlhash=tLm8&amp;trk=public_profile_project-title" title="Internet of Things - Reference Architecture" rel="nofollow" data-tracking-control-name="public_profile_project-title" data-tracking-will-navigate>
        Internet of Things - Reference Architecture
      </a>
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          
    
              



  <span class="date-range">
<time>Jan 2014</time> - Present<!---->      </span>

          
  
      </h4>

    

    <div class="profile-section-card__meta">
      
      
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    The RA for Internet of Things takes different requirements and composes a software stack to cater to these requirements. This includes Device Agents, Big Data, Complex Event Processing and MQTT aspects and technologies.
<!---->      </p>

<!---->    </div>

      <div class="personal-project__contributors-heading">Other creators</div>
      
<ul class="face-pile__list personal-project__contributors">
<li class="face-pile__list-item">
        <a href="https://lk.linkedin.com/in/afkhamazeez?trk=public_profile_project_contributor-image" class="face-pile__url" title="Afkham Azeez" data-tracking-control-name="public_profile_project_contributor-image" data-tracking-will-navigate>
          
  <img class="artdeco-entity-image artdeco-entity-image--circle-3
       face-pile__profile-photo" data-delayed-url="https://media.licdn.com/dms/image/C4E03AQE-WYu1g5qnvg/profile-displayphoto-shrink_100_100/0/1529503400600?e=1687392000&amp;v=beta&amp;t=NFNOj8zhPqkMyThsTteFtIiCMePJtxGXAGJbJVEtQEc" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Afkham Azeez">

        </a>
    </li><li class="face-pile__list-item">
        <a href="https://uk.linkedin.com/in/paulfremantle?trk=public_profile_project_contributor-image" class="face-pile__url" title="Paul Fremantle" data-tracking-control-name="public_profile_project_contributor-image" data-tracking-will-navigate>
          
  <img class="artdeco-entity-image artdeco-entity-image--circle-3
      artdeco-entity-image--ghost face-pile__profile-photo" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Paul Fremantle">

        </a>
    </li>    </ul>

      <a class="personal-project__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fgithub%2Ecom%2Fdulichan%2Fiot-ref-arch&amp;urlhash=tLm8&amp;trk=public_profile_project-button" title="Internet of Things - Reference Architecture" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_project-button" data-tracking-will-navigate>
        See project<img class="personal-project__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
      </a>
  
    </div>
  </div>

  
</li>


        












<li class="profile-section-card  personal-project">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fgithub%2Ecom%2Fwso2%2Fproduct-emm&amp;urlhash=nBLV&amp;trk=public_profile_project-title" title="WSO2 Mobile Device Management (MDM)" rel="nofollow" data-tracking-control-name="public_profile_project-title" data-tracking-will-navigate>
        WSO2 Mobile Device Management (MDM)
      </a>
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          
    
              



  <span class="date-range">
<time>Apr 2013</time> - Present<!---->      </span>

          
  
      </h4>

    

    <div class="profile-section-card__meta">
      
      
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    Today, customers, partners, suppliers & employees have access to the  latest smart mobile devices. They all want to use their personal devices when engaging with the company, triggering many challenges from security, provisioning, governance and even monitoring these devices. Not to mention the challenges that will appear around the numerous apps & data consumed by these user groups for various business tasks. In order to overcome these challenges a strong mobile device management platform is…
        




<button class="show-more-less-text__button show-more-less-button
    show-more-less-text__button--more" data-tracking-control-name="public_profile_project-description_show-more-text-btn" aria-expanded="false">
    Show more

      <icon class="show-more-less-text__button-icon show-more-less-button-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/cyolgscd0imw2ldqppkrb84vo"></icon>
</button>

  </p>

    <p class="show-more-less-text__text--more" tabindex="-1">
      Today, customers, partners, suppliers & employees have access to the  latest smart mobile devices. They all want to use their personal devices when engaging with the company, triggering many challenges from security, provisioning, governance and even monitoring these devices. Not to mention the challenges that will appear around the numerous apps & data consumed by these user groups for various business tasks. In order to overcome these challenges a strong mobile device management platform is essential for today’s mobile enterprise. A solid MDM platform will provide required functionality for an enterprise to securely provision, govern and monitor variety of mobile devices across different platforms within an organization. MDM platforms help organizations manage associated business risks, reduce support costs and the successful implementation of managed BYOD policies.
        




<button class="show-more-less-text__button show-more-less-button
    show-more-less-text__button--less" data-tracking-control-name="public_profile_project-description_show-less-text-btn" aria-expanded="true">
    Show less

      <icon class="show-more-less-text__button-icon show-more-less-button-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/4chtt12k98xwnba1nimld2oyg"></icon>
</button>

    </p>
</div>

      <div class="personal-project__contributors-heading">Other creators</div>
      
<ul class="face-pile__list personal-project__contributors">
<li class="face-pile__list-item">
        <a href="https://sg.linkedin.com/in/chaturadilan?trk=public_profile_project_contributor-image" class="face-pile__url" title="Dilan Perera" data-tracking-control-name="public_profile_project_contributor-image" data-tracking-will-navigate>
          
  <img class="artdeco-entity-image artdeco-entity-image--circle-3
       face-pile__profile-photo" data-delayed-url="https://media.licdn.com/dms/image/D5603AQEF7sNdQ9328A/profile-displayphoto-shrink_100_100/0/1676181330777?e=1687392000&amp;v=beta&amp;t=h6UI9xCyVfvVkW9223rBx9EF9zezqdWs7_KHWf8IH3Y" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Dilan Perera">

        </a>
    </li><li class="face-pile__list-item">
        <a href="https://lk.linkedin.com/in/kasundananjaya?trk=public_profile_project_contributor-image" class="face-pile__url" title="Kasun Dananjaya Delgolla" data-tracking-control-name="public_profile_project_contributor-image" data-tracking-will-navigate>
          
  <img class="artdeco-entity-image artdeco-entity-image--circle-3
       face-pile__profile-photo" data-delayed-url="https://media.licdn.com/dms/image/C5603AQHI0vtBE2G_cQ/profile-displayphoto-shrink_100_100/0/1662652754820?e=1687392000&amp;v=beta&amp;t=sEUvN_9vUjbOdCRMQgn9DtidaGsDUKw4MBP4a5y7M-w" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Kasun Dananjaya Delgolla">

        </a>
    </li><li class="face-pile__list-item">
        
  <img class="artdeco-entity-image artdeco-entity-image--circle-3
      artdeco-entity-image--ghost face-pile__profile-photo" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Mayuran Kunarajah">

    </li><li class="face-pile__list-item">
        
  <img class="artdeco-entity-image artdeco-entity-image--circle-3
      artdeco-entity-image--ghost face-pile__profile-photo" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Dilshan Edirisuriya">

    </li>    </ul>

      <a class="personal-project__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fgithub%2Ecom%2Fwso2%2Fproduct-emm&amp;urlhash=nBLV&amp;trk=public_profile_project-button" title="WSO2 Mobile Device Management (MDM)" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_project-button" data-tracking-will-navigate>
        See project<img class="personal-project__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
      </a>
  
    </div>
  </div>

  
</li>


        












<li class="profile-section-card  personal-project">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fgithub%2Ecom%2Fdulichan%2Fabsolute%2Ejs&amp;urlhash=0O_r&amp;trk=public_profile_project-title" title="Absolute.js - MVC for jaggeryjs" rel="nofollow" data-tracking-control-name="public_profile_project-title" data-tracking-will-navigate>
        Absolute.js - MVC for jaggeryjs
      </a>
  
    </h3>

      <h4 class="profile-section-card__subtitle">
          
    
              



  <span class="date-range">
      <time>
        Jun 2013
      </time>
  </span>

          
  
      </h4>

    

    <div class="profile-section-card__meta">
      
      
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    The objective of absolute.js is to handle front-end development work with simplicity and conventions inside jaggeryJS.
<!---->      </p>

<!---->    </div>

      <div class="personal-project__contributors-heading">Other creators</div>
      
<ul class="face-pile__list personal-project__contributors">
<li class="face-pile__list-item">
        <a href="https://sg.linkedin.com/in/chaturadilan?trk=public_profile_project_contributor-image" class="face-pile__url" title="Dilan Perera" data-tracking-control-name="public_profile_project_contributor-image" data-tracking-will-navigate>
          
  <img class="artdeco-entity-image artdeco-entity-image--circle-3
       face-pile__profile-photo" data-delayed-url="https://media.licdn.com/dms/image/D5603AQEF7sNdQ9328A/profile-displayphoto-shrink_100_100/0/1676181330777?e=1687392000&amp;v=beta&amp;t=h6UI9xCyVfvVkW9223rBx9EF9zezqdWs7_KHWf8IH3Y" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Dilan Perera">

        </a>
    </li><li class="face-pile__list-item">
        <a href="https://lk.linkedin.com/in/kasundananjaya?trk=public_profile_project_contributor-image" class="face-pile__url" title="Kasun Dananjaya Delgolla" data-tracking-control-name="public_profile_project_contributor-image" data-tracking-will-navigate>
          
  <img class="artdeco-entity-image artdeco-entity-image--circle-3
       face-pile__profile-photo" data-delayed-url="https://media.licdn.com/dms/image/C5603AQHI0vtBE2G_cQ/profile-displayphoto-shrink_100_100/0/1662652754820?e=1687392000&amp;v=beta&amp;t=sEUvN_9vUjbOdCRMQgn9DtidaGsDUKw4MBP4a5y7M-w" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Kasun Dananjaya Delgolla">

        </a>
    </li>    </ul>

      <a class="personal-project__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fgithub%2Ecom%2Fdulichan%2Fabsolute%2Ejs&amp;urlhash=0O_r&amp;trk=public_profile_project-button" title="Absolute.js - MVC for jaggeryjs" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_project-button" data-tracking-will-navigate>
        See project<img class="personal-project__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
      </a>
  
    </div>
  </div>

  
</li>


    </ul>
  
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!----><!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      



  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section awards" data-section="awards">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
    Honors & Awards
  
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul class="awards__list">
        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            Best Academic Achievement
          
    </h3>

      <h4 class="profile-section-card__subtitle">
          
            Chamber of Chartered Java Professionals
          
      </h4>

    

    <div class="profile-section-card__meta">
      
            



  <span class="date-range">
      <time>
        Jan 2013
      </time>
  </span>

              
<div class="show-more-less-text">
  <p class="show-more-less-text__text--less">
    My achievements in my academic field of being the youngest Master's student
<!---->      </p>

<!---->    </div>

          
    </div>
  </div>

  
</li>

    </ul>
  
  </div>
</section>




<!----><!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      




  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section languages" data-section="languages">
<!---->
      
        <h2 class="core-section-container__title section-title">
          Languages
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    <ul class="languages__list">
        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            English
          
    </h3>

      <h4 class="profile-section-card__subtitle">
          
            Professional working proficiency
          
      </h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            French
          
    </h3>

      <h4 class="profile-section-card__subtitle">
          
            Limited working proficiency
          
      </h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

        


<li class="profile-section-card ">
<!----><!---->
  <div class="profile-section-card__contents">
    <h3 class="profile-section-card__title">
      
            Japanese
          
    </h3>

      <h4 class="profile-section-card__subtitle">
          
            Elementary proficiency
          
      </h4>

    

    <div class="profile-section-card__meta">
      
    </div>
  </div>

  
</li>

    </ul>
  
  </div>
</section>




<!---->
<!---->
<!----><!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      












  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section recommendations" data-section="recommendations">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
    Recommendations received
  
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
    



  <ul class="show-more-less__list show-more-less__list--no-hidden-elems" data-impression-id="public_profile_show-more-less">
    
          <li class="recommendations__list-item">
            
<div class="endorsement-card flex flex-col">
    
    
      






  <a href="https://lk.linkedin.com/in/kasundananjaya?trk=public_profile_recommendations" target="_self" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link endorsement-card__entity">
    

<!---->
  
      
  <img class="inline-block relative
      rounded-[50%]
      w-6 h-6
      " data-delayed-url="https://media.licdn.com/dms/image/C5603AQHI0vtBE2G_cQ/profile-displayphoto-shrink_100_100/0/1662652754820?e=1687392000&amp;v=beta&amp;t=sEUvN_9vUjbOdCRMQgn9DtidaGsDUKw4MBP4a5y7M-w" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt="Click here to view Kasun Dananjaya Delgolla’s profile">


    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    Kasun Dananjaya Delgolla

<!---->      
      </h3>
      

<!---->
<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
    
          


  <p class="endorsement-card__content body-text text-color-text-low-emphasis">
      &ldquo;I had the privilege to work with Dulitha for more than 3 years  in the same team at WSO2. He is a dynamic person who has various talents in various fields. Specially I should say, he is a JS geek who has an amazing talent when it comes to scripting. When he&#39;s assigned to some work, he always works for the perfection. As a senior developer, he played his role perfectly and his aim was always towards the best.

He always guided his team and he always used to think in the team members perspective when dealing with issues. Working with him in a team is extremely effective and his top notch knowledge in all the areas he works at has always been an inspiration to everyone who works with him. I highly recommend him.&rdquo;
  </p>


        
  
          </div>
    </div>

<!---->      

  </a>




</div>

          </li>
          <li class="recommendations__list-item">
            
<div class="endorsement-card flex flex-col">
    
    
      






  <a href="https://my.linkedin.com/in/harsha-purasinghe-8713504?trk=public_profile_recommendations" target="_self" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link endorsement-card__entity">
    

<!---->
  
      
  <img class="inline-block relative
      rounded-[50%]
      w-6 h-6
      " data-delayed-url="https://media.licdn.com/dms/image/C5603AQHIUuwSJKSkhw/profile-displayphoto-shrink_100_100/0/1626066893603?e=1687392000&amp;v=beta&amp;t=3Ndi7s97LN9sLyD8G3CblSh8qfWwcc7YqIplkiLUGn4" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt="Click here to view Harsha Purasinghe’s profile">


    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    Harsha Purasinghe

<!---->      
      </h3>
      

<!---->
<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
    
          


  <p class="endorsement-card__content body-text text-color-text-low-emphasis">
      &ldquo;I hired Dulitha in 2013 to work for WSO2 Mobile - a startup which was founded together with WSO2 Inc. - World’s Leading Open Source Middleware Company. Dulitha was part of the engineering team which built WSO2 EMM (Enterprise Mobility Manager). He was an extremely talented geeky teenager, and was the youngest person to work in the company. Dulitha was self motivated &amp; extremely passionate about understanding deep technical stuff. He contributed immensely to WSO2EMM code. He always wanted to work on solving difficult challenges. He was also a good team player and offered required assistance to his team members without any hesitation. Dulitha also possess excellent written &amp; spoken communication skills.  I have no hesitation in recommending Dulitha for any employer or any challenging software engineering project. &rdquo;
  </p>


        
  
          </div>
    </div>

<!---->      

  </a>




</div>

          </li>
          <li class="recommendations__list-item">
            
<div class="endorsement-card flex flex-col">
    
    
      






  <a href="https://www.linkedin.com/in/nuwanbando?trk=public_profile_recommendations" target="_self" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link endorsement-card__entity">
    

<!---->
  
      
  <img class="inline-block relative
      rounded-[50%]
      w-6 h-6
      " data-delayed-url="https://media.licdn.com/dms/image/C5603AQFg5XPFKV3nJQ/profile-displayphoto-shrink_100_100/0/1516349866917?e=1687392000&amp;v=beta&amp;t=ZjG43hP5-VnByC5tucOJg8t2grv7V3jCkhAXSaJe5Cc" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt="Click here to view Nuwan Bandara’s profile">


    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    Nuwan Bandara

<!---->      
      </h3>
      

<!---->
<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
    
          


  <p class="endorsement-card__content body-text text-color-text-low-emphasis">
      &ldquo;One of those guys who&#39;s never afraid to jump to the deep end without knowing how deep the water is and somehow manage to survive :) 

Simply put Dulitha is a geek, who questions everything and tries to children the best solution for a given problem. Dulitha had worked with me in product development as well as in tough customer engagements and I was always been able to count on him. He is a sharp developer and a great team player. I wish him all the best.&rdquo;
  </p>


        
  
          </div>
    </div>

<!---->      

  </a>




</div>

          </li>
          <li class="recommendations__list-item">
            
<div class="endorsement-card flex flex-col">
    
    
      






  <a href="https://www.linkedin.com/in/codoxide?trk=public_profile_recommendations" target="_self" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link endorsement-card__entity">
    

<!---->
  
      
  <img class="inline-block relative
      rounded-[50%]
      w-6 h-6
      " data-delayed-url="https://media.licdn.com/dms/image/D4E03AQGCtmaPoOu7Mw/profile-displayphoto-shrink_100_100/0/1679289718777?e=1687392000&amp;v=beta&amp;t=p7URjJoSYi32xXeeaBkZ3bZNHS_orhfoX1tCEFtTXDU" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt="Click here to view Sameera Perera’s profile">


    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    Sameera Perera

<!---->      
      </h3>
      

<!---->
<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
    
          


  <p class="endorsement-card__content body-text text-color-text-low-emphasis">
      &ldquo;Dulitha was one of the youngest people that the we had recruited. But, from very early on, he was able to carve out his space in the team by demonstrating a great deal of commitment and innovative thinking. He was particularly impressive leading the team&#39;s transition in to a new UI paradigm as well as the R&amp;D in the IoT space. Not just a brilliant engineer, Dulitha proved himself to be a valuable asset, being on-site for several key customer accounts and delivering to the customer&#39;s delight.&rdquo;
  </p>


        
  
          </div>
    </div>

<!---->      

  </a>




</div>

          </li>
          <li class="recommendations__list-item">
            
<div class="endorsement-card flex flex-col">
    
    
      






  <a href="https://nz.linkedin.com/in/thilan-maduranga-pathirage-2272b321?trk=public_profile_recommendations" target="_self" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link endorsement-card__entity">
    

<!---->
  
      
  <img class="inline-block relative
      rounded-[50%]
      w-6 h-6
      " data-delayed-url="https://media.licdn.com/dms/image/D5603AQHJGtEj7XtX6w/profile-displayphoto-shrink_100_100/0/1674424005260?e=1687392000&amp;v=beta&amp;t=3Eb-g_lT52BZWR6w6262fLjQq2Jl4cx0IT_q3A_wX-U" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt="Click here to view Thilan Maduranga Pathirage’s profile">


    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    Thilan Maduranga Pathirage

<!---->      
      </h3>
      

<!---->
<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
    
          


  <p class="endorsement-card__content body-text text-color-text-low-emphasis">
      &ldquo;Dulitha is good partner and a good friend in my career.&rdquo;
  </p>


        
  
          </div>
    </div>

<!---->      

  </a>




</div>

          </li>
          <li class="recommendations__list-item">
            
<div class="endorsement-card flex flex-col">
    
    
      






  <a href="https://lk.linkedin.com/in/sameera-chathuranga?trk=public_profile_recommendations" target="_self" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link endorsement-card__entity">
    

<!---->
  
      
  <img class="inline-block relative
      rounded-[50%]
      w-6 h-6
      " data-delayed-url="https://media.licdn.com/dms/image/C5603AQGloNNA7yVoQA/profile-displayphoto-shrink_100_100/0/1647527287167?e=1687392000&amp;v=beta&amp;t=3CsYJTgKqVxfjvmQkAwRY-xRr0I9ZBKGNZo2ZNEQyh4" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt="Click here to view Sameera Chathuranga’s profile">


    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    Sameera Chathuranga

<!---->      
      </h3>
      

<!---->
<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
    
          


  <p class="endorsement-card__content body-text text-color-text-low-emphasis">
      &ldquo;Dulitha has a sound knowledge about Information Security and he is good learner about like that areas, our research was very successful.&rdquo;
  </p>


        
  
          </div>
    </div>

<!---->      

  </a>




</div>

          </li>
          <li class="recommendations__list-item">
            
<div class="endorsement-card flex flex-col">
    
    
      






  <a href="https://lk.linkedin.com/in/thpubs?trk=public_profile_recommendations" target="_self" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link endorsement-card__entity">
    

<!---->
  
      
  <img class="inline-block relative
      rounded-[50%]
      w-6 h-6
      " data-delayed-url="https://media.licdn.com/dms/image/C5103AQEmAys32VATTw/profile-displayphoto-shrink_100_100/0/1558884432848?e=1687392000&amp;v=beta&amp;t=9RPT-aqTXquRsveOsUrw5WNqjFPMjQc9l0I7N1BHkaM" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt="Click here to view Pubudu Kodikara’s profile">


    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    Pubudu Kodikara

<!---->      
      </h3>
      

<!---->
<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
    
          


  <p class="endorsement-card__content body-text text-color-text-low-emphasis">
      &ldquo;Dulitha is a great young talent who knows what he is doing. Currently, he is working as a SMO in my site. He does the job perfectly. He knows how to get traffic from many popular social networks (Specially Stumble).

Not only that, he also have a lot of good ideas and helps us to improve our site. He doesn&#39;t stop by just doing his job. He keeps helping us to improve our site by giving more and more ideas!&rdquo;
  </p>


        
  
          </div>
    </div>

<!---->      

  </a>




</div>

          </li>
          <li class="recommendations__list-item">
            
<div class="endorsement-card flex flex-col">
    
    
      






  <a href="https://lk.linkedin.com/in/dr-ishantha-siribaddana-11897413?trk=public_profile_recommendations" target="_self" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link endorsement-card__entity">
    

<!---->
  
      
  <img class="inline-block relative
      rounded-[50%]
      w-6 h-6
      " data-delayed-url="https://media.licdn.com/dms/image/C4D03AQEHmUqgRdUKQQ/profile-displayphoto-shrink_100_100/0/1516515030565?e=1687392000&amp;v=beta&amp;t=u-jESuUA-mE-ct-QEMRtBeQqadj0rpY-1lULnaLg_gA" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt="Click here to view Dr Ishantha Siribaddana’s profile">


    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
    Dr Ishantha Siribaddana

<!---->      
      </h3>
      

<!---->
<!---->
          <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
            
    
          


  <p class="endorsement-card__content body-text text-color-text-low-emphasis">
      &ldquo;Dulitha is one of the best students I have ever taught at IJTS during past 6 years. I met him when he was just 16 years old but his way of learning new deep contents were really fascinating. He is having capacity to dig into the deep area of the subject. He is dedicated and having a passion of achieving targets. Also he is futuristic and analytical about his outcomes. I wish him for a delightful future with global achievements young in his age.&rdquo;
  </p>


        
  
          </div>
    </div>

<!---->      

  </a>




</div>

          </li>
      
  </ul>


    <p class="recommendations__cta">
      <span class="recommendations__count">
        9 people have recommended Dulitha
      </span>

      <a class="recommendations__cta-link" href="https://www.linkedin.com/signup/public-profile-join?vieweeVanityName=dulithawijewantha&amp;trk=public_profile_recommendations" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate>
          Join now to view
      </a>
    </p>
  
  </div>
</section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      








  
  
<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section recommended-content" data-section="posts">
<!---->
      
        <h2 class="core-section-container__title section-title">
          
      More activity by Dulitha
    
        </h2>
    
    
<!---->
  <div class="core-section-container__content break-words">
    
        <ul class="recommended-content__list">
            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    hover:show-play-button focus:show-play-button
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/alinav_in-the-past-b2b-marketers-were-associated-activity-7052297659037970432-cljv?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      In the past b2b marketers were associated with the department that printed t-shirts with the company logo. Or the department that runs the social…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          hover:show-play-button focus:show-play-button">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D4E05AQE7-RzumBt0Eg/videocover-low/0/1681398768579?e=2147483647&amp;v=beta&amp;t=wxJcdkOosu-CxK51XsXF-VbQiu3kh0RhC8GLO34WYuc" alt>
  
          <icon class="base-main-card__play-button w-auto overlay-center play-button" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9n9raq7fmdu241tpsxwodsmcd" data-svg-class-name="base-main-card__play-button-svg"></icon>
      </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      In the past b2b marketers were associated with the department that printed t-shirts with the company logo. Or the department that runs the social…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/lucaronin_some-of-the-best-engineering-teams-dont-activity-7051834737027338240-4Qsn?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      Some of the best engineering teams DON'T use a Staging env before release. They just push to production. Why?
I talked with tens of teams and here is…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D4E22AQGvvTEXJDsyyg/feedshare-shrink_800/0/1681288416227?e=2147483647&amp;v=beta&amp;t=NFchwXXAvYi5xd3BOwJxUyqUZpvE-94Malndjjd-PHc" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      Some of the best engineering teams DON'T use a Staging env before release. They just push to production. Why?
I talked with tens of teams and here is…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/marksinnathamby_im-very-intrigued-by-humata-httpswwwhumataai-activity-7053232686424879104-DovJ?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      I'm very intrigued by Humata (https://www.humata.ai/). Something I would like to try out and utilize, in order to augment my research/reading…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D4E22AQHtUSiVcRvAVw/feedshare-shrink_800/0/1681477301508?e=2147483647&amp;v=beta&amp;t=ADSWY85W7jS82YxHYGN1yRwtz320xMS0ivL4IV85XU8" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      I'm very intrigued by Humata (https://www.humata.ai/). Something I would like to try out and utilize, in order to augment my research/reading…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/paramiej_leadership-fellowship-career-activity-7052988423602671616-et5Q?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      It's not everyday that you get accepted into a three-year prestigious fellowship afforded only to 50 people worldwide. 
Absolutely thrilled (and a…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D5622AQEREaYgprO7_w/feedshare-shrink_800/0/1681563477650?e=2147483647&amp;v=beta&amp;t=4HJgiA-_KUjugz9yg5TfOdh4p_PgwVPq6FuoIUgJ1ps" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      It's not everyday that you get accepted into a three-year prestigious fellowship afforded only to 50 people worldwide. 
Absolutely thrilled (and a…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/ragnarmeitern_well-deserved-recognition-markus-villigi-activity-7051978436147372033-zR6X?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      Well deserved recognition Markus Villig…I still recall roaming the streets of Mayfair looking for B money. How times have changed. Well done!
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D4D22AQH2b3Q_2ruQnw/feedshare-shrink_2048_1536/0/1681310909442?e=2147483647&amp;v=beta&amp;t=mG-T28VBvofqc3DeFBVsdGR47QtBWqBs3oGTFu15uq4" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      Well deserved recognition Markus Villig…I still recall roaming the streets of Mayfair looking for B money. How times have changed. Well done!
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    hover:show-play-button focus:show-play-button
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/newan-vinthusa_buildingfromzero-startup-activity-7051843922867744769-1Vrf?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      My journey with Code94 Labs for the past 2.5 years⚡🚀

Not the type of content I would post on LinkedIn but if there's anything I want to show, it's…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          hover:show-play-button focus:show-play-button">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D5605AQGf4XiEEMcxgQ/videocover-low/0/1681290607776?e=2147483647&amp;v=beta&amp;t=6XtND0CJhvHpJrbIW9DuyMbcRMPjXQ07m7C0CO3cLTk" alt>
  
          <icon class="base-main-card__play-button w-auto overlay-center play-button" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9n9raq7fmdu241tpsxwodsmcd" data-svg-class-name="base-main-card__play-button-svg"></icon>
      </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      My journey with Code94 Labs for the past 2.5 years⚡🚀

Not the type of content I would post on LinkedIn but if there's anything I want to show, it's…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/colin-gallagher-growlancer_192-chatgpt-prompts-to-10x-your-productivity-activity-7051827550204948480-nPWr?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      192 ChatGPT prompts to 10x your productivity at work…in ALL departments 

If you’re not using AI at work, you’re falling behind.  

So I created…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D5622AQFENu3Jh4f-og/feedshare-shrink_800/0/1681286706921?e=2147483647&amp;v=beta&amp;t=IJLqJXh-PcGmL61Jp1VSzNdAriYpQSZA0KqXta4W3LQ" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      192 ChatGPT prompts to 10x your productivity at work…in ALL departments 

If you’re not using AI at work, you’re falling behind.  

So I created…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/bondleung_yc23-winterbatch-startupecosystem-activity-7052052770912141314-_hoT?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      I'm beyond excited with the Y Combinator Winter Batch of 2023! With over 20,000 applications received from founders all around the world, only 282…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D5622AQEy4omMQeZp4w/feedshare-shrink_2048_1536/0/1681283619058?e=2147483647&amp;v=beta&amp;t=suc1wC-bbZCQ_2Wm-IHnB_ErW-smkAgar2985kqOy1Q" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      I'm beyond excited with the Y Combinator Winter Batch of 2023! With over 20,000 applications received from founders all around the world, only 282…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





            













  <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
    
    base-main-card--link main-activity-card">
    

    <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/ybernstein_anybody-who-does-podcasts-knows-that-every-activity-7052054480946671616-O8e_?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
      
      <span class="sr-only">
          
      
      Anybody who does podcasts knows that every listen is hard earned! Thanks to all the fans and supporters who have gotten us to this huge milestone 🙏…
  
  
      </span>
    </a>

  
      <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
          ">
        
    <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D5622AQEIGdJTZsd8PA/feedshare-shrink_800/0/1681340807779?e=2147483647&amp;v=beta&amp;t=FvlWq_tyJsCGDpO7JP52Sq7BVpfcBQZEegzstnMRp-w" alt>
  
<!---->          </div>

    <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
      <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
          ">
        
      Anybody who does podcasts knows that every listen is hard earned! Thanks to all the fans and supporters who have gotten us to this huge milestone 🙏…
  
      </h3>
      

        <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
          
    Liked by <a href="https://sg.linkedin.com/in/dulithawijewantha?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Dulitha Wijewantha</a>
  
        </h4>

<!---->
<!---->        </div>

<!---->      

  </div>





        </ul>
    
  </div>
</section>




<!---->
    













<section class="core-section-container my-3 bottom-cta-banner">
<!---->
<!---->
<!---->
  <div class="core-section-container__content break-words">
    
  


<section class="hidden-summary container-lined p-3 overflow-hidden babybear:p-2" data-impression-id="public_profile_bottom-cta-banner_guest_hidden_summary">
        <h2 class="hidden-summary__title text-xl text-color-text overflow-hidden break-words mb-2 leading-regular font-normal">
          View Dulitha’s full profile
        </h2>

  <ul class="hidden-summary__summary-items">
          <li class="hidden-summary__summary-item flex text-md text-color-text font-normal leading-open items-center mb-1.5 last:mb-0">
            <div class="hidden-summary__summary-item-icon-container flex items-center justify-center shrink-0 mr-1">
              <icon class="hidden-summary__summary-item-icon h-2 w-2
                  " alt data-delayed-url="https://static.licdn.com/aero-v1/sc/h/au8rc359lanmyfaah39izyss1"></icon>
            </div>
            <span class="hidden-summary__summary-item-text overflow-hidden break-words">
              See who you know in common
            </span>
          </li>
          <li class="hidden-summary__summary-item flex text-md text-color-text font-normal leading-open items-center mb-1.5 last:mb-0">
            <div class="hidden-summary__summary-item-icon-container flex items-center justify-center shrink-0 mr-1">
              <icon class="hidden-summary__summary-item-icon h-2 w-2
                  " alt data-delayed-url="https://static.licdn.com/aero-v1/sc/h/bk9h057z1lch588recizysfdc"></icon>
            </div>
            <span class="hidden-summary__summary-item-text overflow-hidden break-words">
              Get introduced
            </span>
          </li>
          <li class="hidden-summary__summary-item flex text-md text-color-text font-normal leading-open items-center mb-1.5 last:mb-0">
            <div class="hidden-summary__summary-item-icon-container flex items-center justify-center shrink-0 mr-1">
              <icon class="hidden-summary__summary-item-icon h-2 w-2
                  " alt data-delayed-url="https://static.licdn.com/aero-v1/sc/h/engl6kavv3716laqjpfbilqqt"></icon>
            </div>
            <span class="hidden-summary__summary-item-text overflow-hidden break-words">
              Contact Dulitha directly
            </span>
          </li>
  </ul>

      
          <a class="hidden-summary__cta hidden-summary__cta--secondary btn-sm !text-[16px] btn-secondary-emphasis inline-block mt-3 mr-1.5" href="https://www.linkedin.com/signup/public-profile-join?vieweeVanityName=dulithawijewantha&amp;trk=public_profile_bottom-cta-banner" data-tracking-control-name="public_profile_bottom-cta-banner" data-tracking-will-navigate>
              Join to view full profile
          </a>
    
</section>


  </div>
</section>



  </section>



<!---->  
      
  
    </div>
  </section>
  <section class="right-rail papabear:w-right-rail-width papabear:ml-column-gutter mamabear:max-w-[790px] mamabear:px-mobile-container-padding babybear:max-w-[790px] babybear:px-mobile-container-padding">
    
    
        




<!---->
<!---->
    




  
  <section class="aside-section-container mb-4 browsemap">

        
        <h2 class="aside-section-container__title section-title">
          
    People also viewed
  
        </h2>
    
      
<!---->
    <div class="aside-section-container__content break-words">
      
    











  <div class="show-more-less aside-profiles-list">
<!---->
    <ul data-max-num-to-show="10" class="show-more-less__list show-more-less__list--hide-after-10" data-impression-id="public_profile_browsemap_show-more-less">
      
        <li>
          






  <a href="https://lk.linkedin.com/in/ragularuban?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-0" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5603AQHh44ljn8vTtw/profile-displayphoto-shrink_100_100/0/1631099495817?e=1687392000&amp;v=beta&amp;t=wT4vc3CmXbh25iujqcCJV5vbPuldL9AHDpI4Rdspno4" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-0"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Ruban Nanthagopal
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Passive Software Maker | Full-Time Explorer | Founder Click Connector | Co-founder Cabbage Apps
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Sri Lanka<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/manujith-pallewatte?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-1" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5103AQG4_HS3qblOng/profile-displayphoto-shrink_100_100/0/1562928483802?e=1687392000&amp;v=beta&amp;t=Pppc5geDSYObOOmRMJhUIwBf-CJZS1UDXEcb8YyXBaM" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-1"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Manujith Pallewatte
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Engineer, Founder, and a wannabe Barista
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Sri Lanka<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/malindapm?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-2" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5603AQEUQ4x2Yejh2A/profile-displayphoto-shrink_100_100/0/1657823399792?e=1687392000&amp;v=beta&amp;t=3b6n8vk8PDsUhEo483yCGsY0zLU6oEg0jUv1_8UlUJc" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-2"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Malinda Muthumuni
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Founder &amp; CEO of Urban.lk / COO of Hyperglade
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Sri Lanka<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://sg.linkedin.com/in/chalindaabeykoon?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-3" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/D5603AQEqblumtK7tvw/profile-displayphoto-shrink_100_100/0/1669712638634?e=1687392000&amp;v=beta&amp;t=lNsgaVKH0OM2ymET64dq2BOAMRa4wHgKsc-Pyo7z0D0" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-3"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Chalinda Abeykoon
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Investing in early-stage fintech startups in South and Southeast Asia
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Singapore<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://sg.linkedin.com/in/alokagunasekara?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-4" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5103AQFCl1lWhO5fhw/profile-displayphoto-shrink_100_100/0/1583260843398?e=1687392000&amp;v=beta&amp;t=VL5TQH2Ybvcfm4zdXbZ67_UvocT4KKpoXUcd-28hQ9o" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-4"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Aloka Gunasekara
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Helping cross border businesses face macroeconomic challenges
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Singapore<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://my.linkedin.com/in/harsha-purasinghe-8713504?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-5" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5603AQHIUuwSJKSkhw/profile-displayphoto-shrink_100_100/0/1626066893603?e=1687392000&amp;v=beta&amp;t=3Ndi7s97LN9sLyD8G3CblSh8qfWwcc7YqIplkiLUGn4" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-5"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Harsha Purasinghe
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Entrepreneur, Impact Investor, Eisenhower Fellow, Founder/CEO of MiHCM &amp; Microimage, Founded WSO2Mobile 
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Kuala Lumpur City<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/lakshan-de-silva-a9b11328?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-6" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5603AQEXenvbr6M4Tg/profile-displayphoto-shrink_100_100/0/1602519644818?e=1687392000&amp;v=beta&amp;t=-pIfgXi1VHicgOvdzMcL2-tXZLgkp7qsU0tplCfCRYM" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-6"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Lakshan De Silva
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Co-Founder/Co-CEO Hyperglade
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Colombo District<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/nevindaree?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-7" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5103AQE1U-6zGf9xeQ/profile-displayphoto-shrink_100_100/0/1531975708751?e=1687392000&amp;v=beta&amp;t=OMTvvD1KnML-BC-2mLjmg6PQbVMAPmx0QNJpkb0KpIw" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-7"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Nevindaree Premarathne
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Founder &amp; CEO at The Makers
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Sri Lanka<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/hanna-michelle-girdharimal?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-8" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5603AQHeSQ4y2uJ0iA/profile-displayphoto-shrink_100_100/0/1648101579146?e=1687392000&amp;v=beta&amp;t=QitBXR9ys0Pv_Ho_6r9N5IwANFbvZUvCLDOdUQKdzpM" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-8"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Hanna Michelle Girdharimal
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    UI/UX Designer 
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Sri Lanka<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/kasundananjaya?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-9" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5603AQHI0vtBE2G_cQ/profile-displayphoto-shrink_100_100/0/1662652754820?e=1687392000&amp;v=beta&amp;t=sEUvN_9vUjbOdCRMQgn9DtidaGsDUKw4MBP4a5y7M-w" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-9"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Kasun Dananjaya Delgolla
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    CTO at Surge Global | Enterprise Mobility, IoT, Blockchain and Cyber Security Enthusiast
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Sri Lanka<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://www.linkedin.com/in/iroshads?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-10" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/D5603AQHuwyhIuruAvA/profile-displayphoto-shrink_100_100/0/1668767797756?e=1687392000&amp;v=beta&amp;t=9CjjKiIx6Q2RU4YKYccV6wtQZvV55tqLAJtmcHEULWc" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-10"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Irosha de Silva
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Founder &amp; CEO at Marketrix.io | CreativeHub
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          San Francisco, CA<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://sg.linkedin.com/in/suveen-ellawela?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-11" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5603AQE2U6G6puOMlg/profile-displayphoto-shrink_100_100/0/1649084915185?e=1687392000&amp;v=beta&amp;t=J6A-hHe2lSE3NZppwOMy-_pMKkz86N-nzr7KPcYs1Cw" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-11"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Suveen Ellawela
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Computer Engineering at NUS | Research Assistant  |  AI, Blockchain and Startups Enthusiast
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Singapore<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/melissa-seneviratne-753a78149?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-12" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C4D03AQFE16dm8PmlQA/profile-displayphoto-shrink_100_100/0/1657016062832?e=1687392000&amp;v=beta&amp;t=aYnFkrSNvb0b0QgDG8ekdwKNFv5AAv88xIsrBXKg__E" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-12"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Melissa Seneviratne
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Marketing Executive - Project Management at CabbageApps - Join the Farm 👨‍🌾
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Colombo<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://ca.linkedin.com/in/enoshpraveen?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-13" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C5603AQE62REIyiVhpQ/profile-displayphoto-shrink_100_100/0/1593082525316?e=1687392000&amp;v=beta&amp;t=nDIidPO9M3x5qdL52_zQgLV393wAez2RHi-ATKIt8Ug" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-13"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Enosh Praveen
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Skyrocketing Tech Startups through Stories 🚀
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Burnaby, BC<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/cmnisal?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-14" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/D5603AQEkZ0zoU1SY2g/profile-displayphoto-shrink_100_100/0/1665551646564?e=1687392000&amp;v=beta&amp;t=JwiKrXIXH3pzobzjp62k-jABrz5EWTrZfBRZabT6XoM" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-14"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Nisal Chandrasekara
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    I speak 🚀 Web3 Innovations | 🪙 Crypto | 🔗 Blockchain | 🖼 NFTs | 🧑‍🎤 Metaverse | Smart Contracts | SC Audits | dApp Developments | DeFi | Play to Earn | GameFi | Bots and AI 🧠
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Colombo<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/kbandarage?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-15" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/D5603AQGQ9aGaBiUWuA/profile-displayphoto-shrink_100_100/0/1680668689949?e=1687392000&amp;v=beta&amp;t=HN5w3EJjMOWTyiHmbxck-yFCrweGc1Nths8FIExfB3c" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-15"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Kumudu Bandarage
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Enabling agility | Helping to deliver software projects | Senior Project Manager | Scrum Master | Lead Agile Trainer | Wealth Coach | Friend
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Colombo<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/bhanukaharischandra?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-16" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/D4D03AQGuX5Y2lKehpg/profile-displayphoto-shrink_100_100/0/1667218911210?e=1687392000&amp;v=beta&amp;t=Pn5D0tv4bFbe85JPDHdP1_Ah0q5sZdR36e_c39Y1b9s" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-16"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Bhanuka Harischandra
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Forbes 30 under 30 - Digital Strategy, Product + Growth
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Sri Lanka<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://sg.linkedin.com/in/mahishaa-balraj?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-17" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/C4E03AQElncZQmix6vw/profile-displayphoto-shrink_100_100/0/1617624488636?e=1687392000&amp;v=beta&amp;t=fI1oD_8E1blA9aSQRDarOaljZBaDLBmb0Ctwgeu7rZE" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-17"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Mahishaa Balraj
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Attorney-at-Law | Co-Founder at Hashtag Generation
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Singapore<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/nabeel-milhan-b71453124?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-18" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/D5603AQFEzUp3sh3Pqg/profile-displayphoto-shrink_100_100/0/1671783952299?e=1687392000&amp;v=beta&amp;t=AIAd6L29_xZZDqCYVzB6UjXzGQl1sc2J6YKsslzQhfM" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-18"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Nabeel Milhan
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    CEO at oDoc (Techstars | Stanford StartX) | BSc Accounting and Finance, CIMA, CIM
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Sri Lanka<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
        <li>
          






  <a href="https://lk.linkedin.com/in/harindafonseka?trk=public_profile_browsemap" target="_self" data-impression-id="public_profile_browsemap-19" data-tracking-control-name="public_profile_browsemap" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    
    base-aside-card--link">
    

<!---->
  
<!---->
        
          <div class="bg-clip-content bg-contain border-2 border-color-container-neutral-border border-solid box-border h-[56px] rounded-[49.9%] shrink-0 w-[56px]
              " data-delayed-url="https://media.licdn.com/dms/image/D5603AQGZesERfidzCQ/profile-displayphoto-shrink_100_100/0/1671476369840?e=1687392000&amp;v=beta&amp;t=FYc5Bav5sBUQmBrgF_1-VqeKQAjhp0Y14w8it-4CZaY" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-delayed-background data-impression-id="public_profile_browsemap-19"></div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Harinda Fonseka
  
<!---->          </h3>

        <p class="base-aside-card__subtitle font-sans text-sm text-color-text leading-open mt-0.5 break-words">
          
    Systems thinker + Team builder | Founder of gudppl - a new social network to do good #socialentrepreneur
  
        </p>

<!---->
<!---->
        <div class="base-aside-card__metadata font-sans text-sm leading-open font-regular text-color-text-low-emphasis mt-0.5">
          Colombo<!---->
        </div>

<!---->        </div>
  

  </a>




<!---->            </li>
  
    </ul>

        <button class="show-more-less__button show-more-less__more-button show-more-less-button
            " aria-expanded="false" data-tracking-control-name="public_profile_browsemap_show_more">
            
    Show more profiles
  
          <icon class="show-more-less__button--chevron show-more-less-button-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/cyolgscd0imw2ldqppkrb84vo"></icon>
        </button>

        <button class="show-more-less__button show-more-less__less-button show-more-less-button
            show-more-less__button--hide" aria-expanded="false" data-tracking-control-name="public_profile_browsemap_show_more">
            
    Show fewer profiles
  
          <icon class="show-more-less__button--chevron show-more-less-button-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/4chtt12k98xwnba1nimld2oyg"></icon>
        </button>
  </div>


  
    </div>
  </section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
    
  <section class="aside-section-container mb-4">

<!---->
<!---->
    <div class="aside-section-container__content break-words">
      
      




<div class="career-hub-cta container-lined flex flex-row p-2">
  <img class="career-hub-cta__img block mr-1.5 w-[39px] h-[39px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/6jd3nbl8hgvgcpth9addkyx3a" alt>
  <div class="career-hub-cta__content">
    <h2 class="career-hub-cta__title font-sans text-[18px] leading-regular font-bold text-color-text mb-0.5">
      Looking for career advice?
    </h2>
    <p class="career-hub-cta__body font-sans text-sm leading-regular text-color-text">
      Visit the Career Advice Hub to see tips on accelerating your career.
    </p>
    <a href="https://www.linkedin.com/pulse/topics/home/" class="career-hub-cta__btn btn-sm btn-primary inline-block mt-1" data-tracking-control-name="public_profile_career-hub-cta" data-tracking-will-navigate>
      View Career Advice Hub
    </a>
  </div>
</div>

    
    </div>
  </section>


<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      




  
  <section class="aside-section-container mb-4 course-recommendations">

        
        <h2 class="aside-section-container__title section-title">
          
    Add new skills with these courses
  
        </h2>
    
      
<!---->
    <div class="aside-section-container__content break-words">
      
    <ul class="course-recommendations__courses">
        <li class="course-recommendations__course">
          





  <a href="https://www.linkedin.com/learning/java-ee-application-servers?trk=public_profile_recommended-course" target="_self" data-tracking-control-name="public_profile_recommended-course" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    hover:show-play-button focus:show-play-button
    base-aside-card--link aside-learning-course-card">
    

<!---->
  
        <div class="base-aside-card__media flex-shrink-0 h-[54px] mr-0.5 overflow-hidden relative w-[95px]">
          
    <img class="base-aside-card__media-element w-[100px] h-full" alt data-delayed-url="https://media.licdn.com/dms/image/C4E0DAQF2l_XtSCYNOQ/learning-public-crop_144_256/0/1568667255658?e=1682503200&amp;v=beta&amp;t=7Wbu7j50Z2uwGS4QS8MKBcVlHKUsheK2_ws4tQMbQz8">
<!---->      
            <icon class="base-aside-card__play-button w-auto play-button overlay-center" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9n9raq7fmdu241tpsxwodsmcd" data-svg-class-name="base-aside-card__play-button-svg"></icon>
        </div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Java EE: Application Servers
  
<!---->          </h3>

<!---->
<!---->
<!---->
<!---->
<!---->        </div>
  

  </a>




        </li>
        <li class="course-recommendations__course">
          





  <a href="https://www.linkedin.com/learning/java-testing-with-junit-14267963?trk=public_profile_recommended-course" target="_self" data-tracking-control-name="public_profile_recommended-course" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    hover:show-play-button focus:show-play-button
    base-aside-card--link aside-learning-course-card">
    

<!---->
  
        <div class="base-aside-card__media flex-shrink-0 h-[54px] mr-0.5 overflow-hidden relative w-[95px]">
          
    <img class="base-aside-card__media-element w-[100px] h-full" alt data-delayed-url="https://media.licdn.com/dms/image/C560DAQEZJVFAb76R9w/learning-public-crop_144_256/0/1632245793684?e=1682503200&amp;v=beta&amp;t=hFYn_4skWWK2r1oJAdtAHXb7ndLYXtfpwkRuLFePB0c">
<!---->      
            <icon class="base-aside-card__play-button w-auto play-button overlay-center" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9n9raq7fmdu241tpsxwodsmcd" data-svg-class-name="base-aside-card__play-button-svg"></icon>
        </div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Java: Testing with JUnit
  
<!---->          </h3>

<!---->
<!---->
<!---->
<!---->
<!---->        </div>
  

  </a>




        </li>
        <li class="course-recommendations__course">
          





  <a href="https://www.linkedin.com/learning/ajax-with-php-add-dynamic-content-to-websites?trk=public_profile_recommended-course" target="_self" data-tracking-control-name="public_profile_recommended-course" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
    hover:show-play-button focus:show-play-button
    base-aside-card--link aside-learning-course-card">
    

<!---->
  
        <div class="base-aside-card__media flex-shrink-0 h-[54px] mr-0.5 overflow-hidden relative w-[95px]">
          
    <img class="base-aside-card__media-element w-[100px] h-full" alt data-delayed-url="https://media.licdn.com/dms/image/C4E0DAQH63_xdTarXTQ/learning-public-crop_144_256/0/1628887136531?e=1682503200&amp;v=beta&amp;t=WKOtLxQZOeeRy1GkuNw15BA2yo71h9u2NdfJnr65EIE">
<!---->      
            <icon class="base-aside-card__play-button w-auto play-button overlay-center" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9n9raq7fmdu241tpsxwodsmcd" data-svg-class-name="base-aside-card__play-button-svg"></icon>
        </div>

    <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
      <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
        
    Ajax with PHP: Add Dynamic Content to Websites
  
<!---->          </h3>

<!---->
<!---->
<!---->
<!---->
<!---->        </div>
  

  </a>




        </li>
    </ul>
    <a href="https://lk.linkedin.com/learning/?trk=seo_pp_d_cymbii_more_m020_learning" class="course-recommendations__view-all-link" data-tracking-control-name="seo_pp_d_cymbii_more_m020_learning" data-tracking-will-navigate>
      See all courses
    </a>
  
    </div>
  </section>




<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
      






  
  <section class="aside-section-container mb-4 profile-badge">

        
        <h2 class="aside-section-container__title section-title">
          
    Dulitha’s public profile badge
  
        </h2>
    
      
<!---->
    <div class="aside-section-container__content break-words">
      
    <p class="badge__subheading">Include this LinkedIn profile on other websites</p>
    








<article class="profile-card profile-card--badge" itemscope itemtype="http://schema.org/Person">
  <header class="profile-card__header">
    
  <img class="artdeco-entity-image artdeco-entity-image--circle-3
       profile-card__profile-image" data-delayed-url="https://media.licdn.com/dms/image/D5603AQEgXzNMajwHjQ/profile-displayphoto-shrink_800_800/0/1666268942675?e=2147483647&amp;v=beta&amp;t=yK-DC4Zw0JElJ2xINGZB1uzMuKF1JGcFyaUCDVLcJCI" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Dulitha Wijewantha">

    <div class="profile-card__header-info">
        <h3 class="profile-card__header-name" itemprop="name">
          Dulitha Wijewantha
        </h3>
        <p class="profile-card__header-headline" itemprop="jobTitle">Building businesses on the Internet | AI/ ML Experimenter 🔬 | Web3 Degen 🧪 |  Co-Founder @ Aristotle 🧠 | Helping Founders setup &amp; scale tech teams 🧑🏼‍💻 CA(Co-Founder)</p>
    </div>
  </header>
    <section class="profile-card__section ">
      <ul class="profile-card__list">
          
  <li class="profile-list-item profile-list-item--company profile-badge-item" itemprop="affiliation" itemscope itemtype="http://schema.org/Organization">
    






  <img class="artdeco-entity-image artdeco-entity-image--square-1
       profile-list-item__image" data-delayed-url="https://media.licdn.com/dms/image/C4D0BAQGVFjXtnh8c2w/company-logo_100_100/0/1677642489216?e=2147483647&amp;v=beta&amp;t=hNB6eofYGQj4R-wYl1PQCt4b8Mvm2XA8To5qhSI7Ecg" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="company image for Aristotle - Co-Pilot for Cold Sales">

<p class="profile-list-item__name profile-list-item__name--company" itemprop="name">
     Co-Founder &amp; CTO at Aristotle - Co-Pilot for Cold Sales
</p>

  </li>

      </ul>
    </section>
<!---->        <section class="profile-card__section">
<!---->          <ul class="profile-card__list">
          
  <li class="profile-list-item profile-list-item--school profile-badge-item" itemprop="affiliation" itemscope itemtype="http://schema.org/Organization">
    






  <img class="artdeco-entity-image artdeco-entity-image--square-1
       profile-list-item__image" data-delayed-url="https://media.licdn.com/dms/image/C4E0BAQFqUYdjt_BOxw/company-logo_100_100/0/1662029031608?e=2147483647&amp;v=beta&amp;t=Tq3J6Ixi1HlsH8yNMPmu8cwpQ_iU2aKj005JCnpStNc" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" alt="school image for National University of Ireland, Galway">

<p class="profile-list-item__name profile-list-item__name--school" itemprop="name">
    National University of Ireland, Galway
</p>

  </li>

      </ul>
    </section>
<!---->      <footer class="profile-card__footer profile-card__footer--badge">
      <button disabled class="profile-card__footer-button">View profile</button>
      <icon class="profile-card__linkedin-logo" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/a3fnfnqvbbolvy47fxmpit4t4"></icon>
  </footer>
</article>

    <a class="badge__link" href="https://www.linkedin.com/badges/profile/create?vanityname=dulithawijewantha&amp;preferredlocale=en_US&amp;trk=public_profile_badge" data-tracking-control-name="public_profile_badge" data-tracking-will-navigate>
      View profile badges
    </a>
  
    </div>
  </section>





<!---->  
      
  
  </section>
</main>

<!---->
































<footer class="li-footer bg-transparent w-full ">
  <ul class="li-footer__list flex flex-wrap flex-row items-start justify-start w-full h-auto min-h-[50px] my-[0px] mx-auto py-3 px-2 papabear:w-[1128px] papabear:p-0">
    
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    
      <span class="sr-only">LinkedIn</span>
      <icon class="li-footer__copy-logo text-color-logo-brand-alt inline-block self-center h-[14px] w-[56px] mr-1" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/e12h2cd8ac580qen9qdd0qks8"></icon>
      <span class="li-footer__copy-text flex items-center">&copy; 2023</span>
    
</li>

    
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://about.linkedin.com?trk=public_profile_v3_desktop_footer-about" data-tracking-control-name="public_profile_v3_desktop_footer-about" data-tracking-will-navigate>
      
      About
    
    </a>
</li>

    
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/accessibility?trk=public_profile_v3_desktop_footer-accessibility" data-tracking-control-name="public_profile_v3_desktop_footer-accessibility" data-tracking-will-navigate>
      
      Accessibility
    
    </a>
</li>

    
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/legal/user-agreement?trk=public_profile_v3_desktop_footer-user-agreement" data-tracking-control-name="public_profile_v3_desktop_footer-user-agreement" data-tracking-will-navigate>
      
      User Agreement
    
    </a>
</li>

    
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/legal/privacy-policy?trk=public_profile_v3_desktop_footer-privacy-policy" data-tracking-control-name="public_profile_v3_desktop_footer-privacy-policy" data-tracking-will-navigate>
      
      Privacy Policy
    
    </a>
</li>

<!---->        
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/legal/cookie-policy?trk=public_profile_v3_desktop_footer-cookie-policy" data-tracking-control-name="public_profile_v3_desktop_footer-cookie-policy" data-tracking-will-navigate>
      
      Cookie Policy
    
    </a>
</li>

    
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/legal/copyright-policy?trk=public_profile_v3_desktop_footer-copyright-policy" data-tracking-control-name="public_profile_v3_desktop_footer-copyright-policy" data-tracking-will-navigate>
      
      Copyright Policy
    
    </a>
</li>

    
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://brand.linkedin.com/policies?trk=public_profile_v3_desktop_footer-brand-policy" data-tracking-control-name="public_profile_v3_desktop_footer-brand-policy" data-tracking-will-navigate>
      
      Brand Policy
    
    </a>
</li>

      
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/psettings/guest-controls?trk=public_profile_v3_desktop_footer-guest-controls" data-tracking-control-name="public_profile_v3_desktop_footer-guest-controls" data-tracking-will-navigate>
      
        Guest Controls
      
    </a>
</li>

    
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/legal/professional-community-policies?trk=public_profile_v3_desktop_footer-community-guide" data-tracking-control-name="public_profile_v3_desktop_footer-community-guide" data-tracking-will-navigate>
      
      Community Guidelines
    
    </a>
</li>

    
<!---->
      
      
<li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
    
          








<div class="collapsible-dropdown collapsible-dropdown--footer collapsible-dropdown--up flex items-center relative hyphens-auto language-selector z-2">
<!---->
    <ul class="collapsible-dropdown__list hidden container-raised absolute w-auto overflow-y-auto flex-col items-stretch z-1 bottom-[100%] top-auto" role="menu" tabindex="-1">
      
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="العربية (Arabic)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-ar_AE" data-locale="ar_AE" role="menuitem" lang="ar_AE">
            العربية (Arabic)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Čeština (Czech)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-cs_CZ" data-locale="cs_CZ" role="menuitem" lang="cs_CZ">
            Čeština (Czech)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Dansk (Danish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-da_DK" data-locale="da_DK" role="menuitem" lang="da_DK">
            Dansk (Danish)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Deutsch (German)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-de_DE" data-locale="de_DE" role="menuitem" lang="de_DE">
            Deutsch (German)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="English (English) selected" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link--selected" data-tracking-control-name="language-selector-en_US" data-locale="en_US" role="menuitem" lang="en_US">
            <strong>English (English)</strong>
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Español (Spanish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-es_ES" data-locale="es_ES" role="menuitem" lang="es_ES">
            Español (Spanish)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Français (French)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-fr_FR" data-locale="fr_FR" role="menuitem" lang="fr_FR">
            Français (French)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="हिंदी (Hindi)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-hi_IN" data-locale="hi_IN" role="menuitem" lang="hi_IN">
            हिंदी (Hindi)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Bahasa Indonesia (Indonesian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-in_ID" data-locale="in_ID" role="menuitem" lang="in_ID">
            Bahasa Indonesia (Indonesian)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Italiano (Italian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-it_IT" data-locale="it_IT" role="menuitem" lang="it_IT">
            Italiano (Italian)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="日本語 (Japanese)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-ja_JP" data-locale="ja_JP" role="menuitem" lang="ja_JP">
            日本語 (Japanese)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="한국어 (Korean)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-ko_KR" data-locale="ko_KR" role="menuitem" lang="ko_KR">
            한국어 (Korean)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Bahasa Malaysia (Malay)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-ms_MY" data-locale="ms_MY" role="menuitem" lang="ms_MY">
            Bahasa Malaysia (Malay)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Nederlands (Dutch)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-nl_NL" data-locale="nl_NL" role="menuitem" lang="nl_NL">
            Nederlands (Dutch)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Norsk (Norwegian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-no_NO" data-locale="no_NO" role="menuitem" lang="no_NO">
            Norsk (Norwegian)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Polski (Polish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-pl_PL" data-locale="pl_PL" role="menuitem" lang="pl_PL">
            Polski (Polish)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Português (Portuguese)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-pt_BR" data-locale="pt_BR" role="menuitem" lang="pt_BR">
            Português (Portuguese)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Română (Romanian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-ro_RO" data-locale="ro_RO" role="menuitem" lang="ro_RO">
            Română (Romanian)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Русский (Russian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-ru_RU" data-locale="ru_RU" role="menuitem" lang="ru_RU">
            Русский (Russian)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Svenska (Swedish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-sv_SE" data-locale="sv_SE" role="menuitem" lang="sv_SE">
            Svenska (Swedish)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="ภาษาไทย (Thai)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-th_TH" data-locale="th_TH" role="menuitem" lang="th_TH">
            ภาษาไทย (Thai)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Tagalog (Tagalog)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-tl_PH" data-locale="tl_PH" role="menuitem" lang="tl_PH">
            Tagalog (Tagalog)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Türkçe (Turkish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-tr_TR" data-locale="tr_TR" role="menuitem" lang="tr_TR">
            Türkçe (Turkish)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="Українська (Ukrainian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-uk_UA" data-locale="uk_UA" role="menuitem" lang="uk_UA">
            Українська (Ukrainian)
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="简体中文 (Chinese (Simplified))" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-zh_CN" data-locale="zh_CN" role="menuitem" lang="zh_CN">
            简体中文 (Chinese (Simplified))
        </button>
      </li>
      <li class="language-selector__item" role="presentation">
        <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
        <button aria-label="正體中文 (Chinese (Traditional))" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
            language-selector__link !font-regular" data-tracking-control-name="language-selector-zh_TW" data-locale="zh_TW" role="menuitem" lang="zh_TW">
            正體中文 (Chinese (Traditional))
        </button>
      </li>
<!---->      
    </ul>

      
    <button class="language-selector__button select-none relative pr-2 font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover hover:cursor-pointer focus:text-color-link-focus focus:outline-dotted focus:outline-1" aria-expanded="false" data-tracking-control-name="footer-lang-dropdown_trigger">
      <span class="language-selector__label-text mr-0.5 break-words">
        Language
      </span>
      <icon class="language-selector__label-chevron w-2 h-2 absolute top-0 right-0" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/cyolgscd0imw2ldqppkrb84vo"></icon>
    </button>
  
</div>


      
</li>

  </ul>

<!---->    </footer>




      
<form class="google-one-tap" action="https://www.linkedin.com/uas/login-submit" method="post">
  <input name="loginCsrfParam" value="cc965f76-c69c-4efc-8596-b5381e65686e" type="hidden">

    <input name="session_redirect" value="https://sg.linkedin.com/in/dulithawijewantha" type="hidden">

  <input name="trk" value="public_profile_google-one-tap-submit" type="hidden">
  <div id="google-one-tap__container" class="google-one-tap__container" data-tracking-control-name="public_profile_google-one-tap"></div>

  
<div class="loader loader--full-screen">
  <div class="loader__container mb-2 overflow-hidden">
    <icon class="loader__icon inline-block loader__icon--default text-color-progress-loading" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/ddi43qwelxeqjxdd45pe3fvs1" data-svg-class-name="loader__icon-svg--large fill-currentColor h-[60px] min-h-[60px] w-[60px] min-w-[60px]"></icon>
  </div>
</div>

</form>


      












  <div class="cta-modal overflow-hidden container-raised z-10 fixed bottom-3 right-3 min-h-[56px] p-2 babybear:hidden conversion-modal" data-impression-id="public_profile_conversion-modal_cta-modal" role="dialog" aria-labelledby="cta-modal-header" aria-describedby="cta-modal-subheader">
      <h2 id="cta-modal-header" class="cta-modal__header text-xl leading-regular font-bold text-color-text mr-[28px]">You’re signed out</h2>

      <h3 id="cta-modal-subheader" class="cta-modal__subheader text-md leading-open font-normal text-color-text mt-0.5">Sign in for the full experience.</h3>

    
  <a class="cta-modal__primary-btn btn-md btn-primary inline-block w-full mt-3" href="https://www.linkedin.com/login?session_redirect=https%3A%2F%2Fsg%2Elinkedin%2Ecom%2Fin%2Fdulithawijewantha&amp;fromSignIn=true&amp;trk=public_profile_conversion-modal-signin" data-tracking-control-name="public_profile_conversion-modal-signin" data-tracking-will-navigate>
    Sign in
  </a>

    <div class="cta-modal__google-sign-in-container mt-1.5">
        


<form class="google-sign-in-cta-widget" action="https://www.linkedin.com/uas/login-submit" method="post" novalidate>
  <input name="loginCsrfParam" value="cc965f76-c69c-4efc-8596-b5381e65686e" type="hidden">

    <input name="session_redirect" value="https://sg.linkedin.com/in/dulithawijewantha" type="hidden">

  <input name="trk" value="public_profile_google-sign-in-submit" type="hidden">
  <button class="google-sign-in-cta-widget__btn btn-md btn-secondary hover:cursor-pointer flex items-center justify-center w-full h-auto" data-tracking-control-name="public_profile_google-sign-in-btn" data-tracking-litms type="button">
    <icon class="google-sign-in-cta-widget__icon onload w-[18px] min-h-[18px] leading-[18px] block" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/36lpn9v7fqsm6i7t6ny8bgacs"></icon>
    <span class="google-sign-in-cta-widget__text ml-2">Sign in with Google</span>
  </button>

  
<div class="loader loader--full-screen">
  <div class="loader__container mb-2 overflow-hidden">
    <icon class="loader__icon inline-block loader__icon--default text-color-progress-loading" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/ddi43qwelxeqjxdd45pe3fvs1" data-svg-class-name="loader__icon-svg--large fill-currentColor h-[60px] min-h-[60px] w-[60px] min-w-[60px]"></icon>
  </div>
</div>

</form>

      <div class="cta-modal__google-divider flex -mb-1.5">
        <hr class="cta-modal__divider artdeco-divider my-3 w-full">
        <p class="cta-modal__or text-md font-bold leading-open text-color-text mx-1 self-center">or</p>
        <hr class="cta-modal__divider artdeco-divider my-3 w-full">
      </div>
    </div>
    <a class="cta-modal__secondary-btn btn-md inline-block w-full mt-1.5
        cta-modal__secondary-btn--with-google btn-secondary text-color-text-secondary px-4 align-middle" href="https://www.linkedin.com/signup/public-profile-join?vieweeVanityName=dulithawijewantha&amp;trk=public_profile_conversion-modal-join&amp;session_redirect=https%3A%2F%2Fsg.linkedin.com%2Fin%2Fdulithawijewantha" data-tracking-control-name="public_profile_conversion-modal-join" data-tracking-will-navigate>
      Join now
    </a>

<!---->    

    <button class="cta-modal__dismiss-btn absolute top-2 right-2 hover:cursor-pointer focus:outline focus:outline-2 focus:outline-color-action" data-tracking-control-name="public_profile_conversion-modal_dismiss" aria-label="Dismiss">
      <icon class="cta-modal__dismiss-icon block h-3 w-3 onload" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/gs508lg3t2o81tq7pmcgn6m2"></icon>
    </button>
  </div>



<!---->
<!---->
<!---->
<!---->
      <code id="enableFingerprintingJS" style="display: none"><!--true--></code>
      <code id="fingerprintingUrlPath" style="display: none"><!--"/platform-telemetry/li/collect"--></code>
      <code id="fingerprintingWaitTime" style="display: none"><!--2000--></code>
      <code id="fid" style="display: none"><!--"AQHcESqLNm9vmgAAAYeY2P0OQU9IlPjatTJQ0FugmBtHJKUhs86j2nnlzkcd5RA5TM2MLYTJ6KKlSw"--></code>

    <code id="enablePlatformJs" style="display: none"><!--true--></code>

      
<img class="bc " style="display:none;" width="1" height="1" data-delayed-url="https://ponf.linkedin.com/pixel/tracking.png?reqid=tid-AAX5rQ+ZLb9/4D+yXRmROA==&amp;pageInstance=urn:li:page:public_profile_v3;Z64X4UhDSA2Th17HCWPmjw==&amp;js=enabled">
  <noscript>
    <img class="bc " style="display:none;" width="1" height="1" src="https://ponf.linkedin.com/pixel/tracking.png?reqid=tid-AAX5rQ+ZLb9/4D+yXRmROA==&amp;pageInstance=urn:li:page:public_profile_v3;Z64X4UhDSA2Th17HCWPmjw==&amp;js=disabled">
  </noscript>


    
<script src="https://static.licdn.com/aero-v1/sc/h/bntclbhfr633k1ub1kgifaw9w" async></script>

  

        <script src="https://static.licdn.com/aero-v1/sc/h/cy523xojuc8yvy6fyiy9hd1el" async></script>
      
      <script data-delayed-url="https://static.licdn.com/aero-v1/sc/h/etkd25e7kzp2lrg1w9y0kixlu" data-module-id="google-sign-in-lib"></script>
      <script data-delayed-url="https://static.licdn.com/aero-v1/sc/h/98lptr8kagfxge22q7k1fps8" data-module-id="google-one-tap-lib"></script>
      
<script id="insightsTag" type="text/javascript">
  _linkedin_partner_id = "3252572"; window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script><script type="text/javascript">
  (function(l) { if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])}; window.lintrk.q=[]} var s =
  document.getElementsByTagName("script")[0]; var b = document.createElement("script"); b.type =
  "text/javascript";b.async = true; b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
<noscript>
  <img height="1" width="1" style="display:none;" alt src="https://px.ads.linkedin.com/collect/?pid=3252572&amp;fmt=gif">
</noscript>

  
  </body>
</html>
    `;

    const markup = `
    <!DOCTYPE html>
    
        
        
        
        
    
        
        <html lang="en">
          <head>
            <meta name="pageKey" content="public_profile_v3_desktop">
    <!---->        <meta name="locale" content="en_US">
            <meta id="config" data-app-version="2.0.1067" data-call-tree-id="AAX5sWBwuKBpLkGiq+F0Lg==" data-multiproduct-name="public-profile-frontend" data-service-name="public-profile-frontend" data-browser-id="cc965f76-c69c-4efc-8596-b5381e65686e" data-enable-page-view-heartbeat-tracking data-disable-comscore-tracking data-page-instance="urn:li:page:public_profile_v3;/ROiwfrsRpy21qLoz2CHnA==" data-disable-jsbeacon-pagekey-suffix="false" data-member-id="0" data-msafdf-lib="https://static.licdn.com/aero-v1/sc/h/6r58rkh35e7x4dqy7terugz6s" data-logout-url="/uas/logout" data-is-li-sugr-tracking-enabled>
    
            <link rel="canonical" href="https://lk.linkedin.com/in/kekayan">
    <!----><!---->
    <!---->
    <!---->
              <meta property="al:android:url" content="https://lk.linkedin.com/in/kekayan">
              <meta property="al:android:package" content="com.linkedin.android">
              <meta property="al:android:app_name" content="LinkedIn">
              <meta property="al:ios:url" content="https://lk.linkedin.com/in/kekayan">
              <meta property="al:ios:app_store_id" content="288429040">
              <meta property="al:ios:app_name" content="LinkedIn">
    
    <!---->
              <link rel="icon" href="https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca">
    
            <script>
              function getDfd() {let yFn,nFn;const p=new Promise(function(y, n){yFn=y;nFn=n;});p.resolve=yFn;p.reject=nFn;return p;}
              window.lazyloader = getDfd();
              window.tracking = getDfd();
              window.impressionTracking = getDfd();
              window.ingraphTracking = getDfd();
              window.appDetection = getDfd();
              window.pemTracking = getDfd();
            </script>
    
    <!---->
            
            <title>Kekayan Nanthakumar - Senior Software Engineer - Insighture - We&#39;re hiring | LinkedIn</title>
    
            
    
        
    
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="litmsProfileName" content="public-profile-frontend">
    
          <meta name="ubba" content="https://static.licdn.com/aero-v1/sc/h/1qha5a18714fz8dczp2mykaax">
    
        <meta name="platform" content="https://static.licdn.com/aero-v1/sc/h/8mp6num02g91q0ebr3tkbyk8z">
        <meta name="platform-worker" content="https://static.licdn.com/aero-v1/sc/h/7nirg34a8ey4y2l4rw7xgwxx4">
        
    
        
        
        
        
    
          <meta name="description" content="Senior Software Engineer with 2 years of experience in building products from scratch. Proven ability to design, build, debug and maintain complex software.  An energetic individual who's ready to take on any challenges and a constant learner.<br>My core skill set centered around Python, Node.js, and AWS. I am fluent with frameworks like Flask, Fast API, Django, Express, React and SpringBoot. In the infrastructure aspects, my skills range from Docker to AWS services. I have used docker-compose, Vault, AWS ECS, Lambda, SQS, S3, SES, and AWS SAM to name a few.<br>Also, I have used Pytorch and other NumPy, pandas, Matplotlib, and transformers libs.<br>I am capable of picking up new frameworks, infrastructure, and languages with ease.<br>As a Software Engineer now building next-generation NLP products to review contracts.<br><br>Get in touch! | Learn more about Kekayan Nanthakumar's work experience, education, connections &amp; more by visiting their profile on LinkedIn">
          <meta name="og:description" content="Senior Software Engineer with 2 years of experience in building products from scratch. Proven ability to design, build, debug and maintain complex software.  An energetic individual who's ready to take on any challenges and a constant learner.<br>My core skill set centered around Python, Node.js, and AWS. I am fluent with frameworks like Flask, Fast API, Django, Express, React and SpringBoot. In the infrastructure aspects, my skills range from Docker to AWS services. I have used docker-compose, Vault, AWS ECS, Lambda, SQS, S3, SES, and AWS SAM to name a few.<br>Also, I have used Pytorch and other NumPy, pandas, Matplotlib, and transformers libs.<br>I am capable of picking up new frameworks, infrastructure, and languages with ease.<br>As a Software Engineer now building next-generation NLP products to review contracts.<br><br>Get in touch! | Learn more about Kekayan Nanthakumar's work experience, education, connections &amp; more by visiting their profile on LinkedIn">
          <meta name="twitter:description" content="Senior Software Engineer with 2 years of experience in building products from scratch. Proven ability to design, build, debug and maintain complex software.  An energetic individual who's ready to take on any challenges and a constant learner.<br>My core skill set centered around Python, Node.js, and AWS. I am fluent with frameworks like Flask, Fast API, Django, Express, React and SpringBoot. In the infrastructure aspects, my skills range from Docker to AWS services. I have used docker-compose, Vault, AWS ECS, Lambda, SQS, S3, SES, and AWS SAM to name a few.<br>Also, I have used Pytorch and other NumPy, pandas, Matplotlib, and transformers libs.<br>I am capable of picking up new frameworks, infrastructure, and languages with ease.<br>As a Software Engineer now building next-generation NLP products to review contracts.<br><br>Get in touch! | Learn more about Kekayan Nanthakumar's work experience, education, connections &amp; more by visiting their profile on LinkedIn">
      
        <meta property="og:title" content="Kekayan Nanthakumar - Senior Software Engineer - Insighture - We&amp;#39;re hiring | LinkedIn">
        <meta property="og:image" content="https://media.licdn.com/dms/image/C5603AQHMqhLLTJzP2A/profile-displayphoto-shrink_800_800/0/1641108903285?e=2147483647&amp;v=beta&amp;t=AZ56v8Cx53N0ZbRHe7e-KGiHgx35FOCWtLXY1PCm1vI">
        <meta property="og:type" content="profile">
    
          <meta property="profile:first_name" content="Kekayan">
    
          <meta property="profile:last_name" content="Nanthakumar">
    
          <meta property="og:url" content="https://lk.linkedin.com/in/kekayan">
        
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@Linkedin">
        <meta name="twitter:title" content="Kekayan Nanthakumar - Senior Software Engineer - Insighture - We&amp;#39;re hiring | LinkedIn">
        <meta name="twitter:image" content="https://media.licdn.com/dms/image/C5603AQHMqhLLTJzP2A/profile-displayphoto-shrink_800_800/0/1641108903285?e=2147483647&amp;v=beta&amp;t=AZ56v8Cx53N0ZbRHe7e-KGiHgx35FOCWtLXY1PCm1vI">
    
    <!---->
    <!---->
    <!---->
        <meta name="robots" content="noarchive">
      
    
              <meta name="clientSideIngraphs" content="1" data-gauge-metric-endpoint="/public-profile/api/ingraphs/guestGauge" data-counter-metric-endpoint="/public-profile/api/ingraphs/counter">
    
    <!---->
            <link rel="stylesheet" href="https://static.licdn.com/aero-v1/sc/h/ew93bnqzc9gosf4vfd82yhvbt">
    
            
        <script type="application/ld+json">
          {"@context":"http://schema.org","@graph":[{"@type":"Person","address":{"@type":"PostalAddress","addressLocality":"Colombo, Western Province, Sri Lanka"},"alumniOf":[{"@type":"Organization","name":"Pearson Lanka","url":"https://lk.linkedin.com/company/pearson-lanka?trk=ppro_cprof","member":{"@type":"OrganizationRole","description":"Implemented a time series forecasting service and deployed it in AWS Fargate.\u003Cbr\u003EImplemented a POC to demonstrate LTI launches & gradings from Google Classroom and Microsoft Education in SpringBoot with Google and Microsoft APIs.","startDate":"2021-03","endDate":"2022-03"}},{"@type":"Organization","name":"Insighture","url":"https://lk.linkedin.com/company/insighture?trk=ppro_cprof","member":{"@type":"OrganizationRole","description":"As a lead python backend developer introduced NSW WWCC into the Weareoho platform which increased their coverage by 20% more.\u003Cbr\u003EDeveloped and evaluated a proof of concept model for detecting and parsing layouts with object detection using PyTorch and Detectron2.\u003Cbr\u003EWrote a python library to receive webhooks in the terminal.","startDate":"2020-08","endDate":"2021-03"}},{"@type":"Organization","name":"Pearson Lanka","url":"https://lk.linkedin.com/company/pearson-lanka?trk=ppro_cprof","location":"Colombo","member":{"@type":"OrganizationRole","description":"Research on similarity search and Semantic Search from embeddings.\u003Cbr\u003ECreated various POC for cloud migrations and ML Projects like Image Classification, NER and Text Classification.","startDate":"2018-09","endDate":"2019-09"}},{"@type":"Organization","name":"Bank of Ceylon","url":"https://lk.linkedin.com/company/bank-of-ceylon?trk=ppro_cprof","location":"Chavakachcheri","member":{"@type":"OrganizationRole","startDate":"2015-01","endDate":"2016-01"}},{"@type":"EducationalOrganization","name":"University of Kelaniya Sri Lanka","url":"https://lk.linkedin.com/school/university-of-kelaniya-sri-lanka/","member":{"@type":"OrganizationRole","description":"CGPA 3.89/4.00","startDate":2016,"endDate":2020}},{"@type":"EducationalOrganization","name":"Hindu College, Chavakachcheri","member":{"@type":"OrganizationRole","description":"G.C.E. (Advance Level Examination) - 2014 (Physical Science Stream)\u003Cbr\u003E         Combined Mathematics A\u003Cbr\u003E         Chemistry A\u003Cbr\u003E         Physics B\u003Cbr\u003E         General English C\u003Cbr\u003E         Z Score 1.8472","startDate":2004,"endDate":2014}}],"awards":["National Youth Hackathon : Hackadev 2017","Ahasi-2016 Annual Art Day"],"image":{"@type":"ImageObject","contentUrl":"https://media.licdn.com/dms/image/C5603AQHMqhLLTJzP2A/profile-displayphoto-shrink_800_800/0/1641108903285?e=2147483647&v=beta&t=AZ56v8Cx53N0ZbRHe7e-KGiHgx35FOCWtLXY1PCm1vI"},"jobTitle":["Senior Software Engineer"],"name":"Kekayan Nanthakumar","sameAs":"https://lk.linkedin.com/in/kekayan","url":"https://lk.linkedin.com/in/kekayan","memberOf":[],"worksFor":[{"@type":"Organization","name":"Insighture - We're hiring","url":"https://lk.linkedin.com/company/insighture?trk=ppro_cprof","member":{"@type":"OrganizationRole","description":"Led a team of engineers, developing a new product from scratch and maintaining the existing product.\u003Cbr\u003EBuilding a new product from scratch using serverless AWS services and NLP.\u003Cbr\u003EArchitected and Deployed a fully serverless product.\u003Cbr\u003EFinetuned the Transformer based models for different downstream tasks.","startDate":"2022-03"}}],"knowsLanguage":[],"interactionStatistic":{"@type":"InteractionCounter","interactionType":"https://schema.org/FollowAction","name":"Follows","userInteractionCount":758},"description":"Senior Software Engineer with 2 years of experience in building products from scratch. Proven ability to design, build, debug and maintain complex software.  An energetic individual who's ready to take on any challenges and a constant learner.\u003Cbr\u003EMy core skill set centered around Python, Node.js, and AWS. I am fluent with frameworks like Flask, Fast API, Django, Express, React and SpringBoot. In the infrastructure aspects, my skills range from Docker to AWS services. I have used docker-compose, Vault, AWS ECS, Lambda, SQS, S3, SES, and AWS SAM to name a few.\u003Cbr\u003EAlso, I have used Pytorch and other NumPy, pandas, Matplotlib, and transformers libs.\u003Cbr\u003EI am capable of picking up new frameworks, infrastructure, and languages with ease.\u003Cbr\u003EAs a Software Engineer now building next-generation NLP products to review contracts.\u003Cbr\u003E\u003Cbr\u003EGet in touch!"},{"@type":"WebPage","url":"https://lk.linkedin.com/in/kekayan","reviewedBy":{"@type":"Person","name":"Kekayan Nanthakumar"}}]}
        </script>
      
          
    <!---->      </head>
          <body dir="ltr">
    <!---->          
              
        
    
        <a href="#main-content" class="skip-link btn-md btn-primary absolute z-11 -top-[100vh] focus:top-0">
          Skip to main content
        </a>
      
    <!---->
            
    <!---->
            
        
          <code id="isClsFixActive" style="display: none"><!--true--></code>
          
        
    
        <a href="#main-content" class="skip-link btn-md btn-primary absolute z-11 -top-[100vh] focus:top-0">
          Skip to main content
        </a>
      
        <header class="header base-detail-page__header px-mobile-container-padding bg-color-background-container global-alert-offset sticky-header">
          
            
    
        
        
        
        
    
        <nav class="nav pt-1.5 pb-2 flex items-center justify-between relative flex-nowrap mamabear:flex-wrap mamabear:gap-y-1 babybear:flex-wrap babybear:py-1.5
             nav--minified-mobile babybear:flex-wrap" aria-label="Primary">
    
          <a href="/?trk=public_profile_nav-header-logo" class="nav__logo-link link-no-visited-state z-1 mr-auto babybear:z-0 babybear:mr-0 babybear:flex-1 hover:no-underline focus:no-underline active:no-underline" data-tracking-control-name="public_profile_nav-header-logo" data-tracking-will-navigate>
              
                  
        
        <span class="sr-only">LinkedIn</span>
          <icon class="nav-logo--inbug flex text-color-brand
              papabear:hidden mamabear:hidden" data-svg-class-name="h-[34px] w-[34px] babybear:h-[27px] babybear:w-[27px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/4zqr0f9jf98vi2nkijyc3bex2"></icon>
          <icon class="block text-color-brand w-[84px] h-[21px] papabear:w-[135px] papabear:h-[34px]
              babybear:hidden" data-test-id="nav-logo" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8fkga714vy9b2wk5auqo5reeb"></icon>
      
              
          </a>
    
    <!---->
            
        
        
        
        
        
        <ul class="top-nav-menu flex items-center nav__menu order-3 after:up-down-divider after:!h-[37px] mr-0.5 babybear:hidden mamabear:hidden">
            <li class>
              
        <a href="https://www.linkedin.com/pulse/topics/home/?trk=public_profile_guest_nav_menu_discover" data-tracking-control-name="public_profile_guest_nav_menu_discover" data-tracking-will-navigate class="top-nav-link flex justify-center items-center h-[52px] hover:text-color-text visited:hover:text-color-text hover:no-underline
            w-[64px] flex-col mx-1
            text-color-text-low-emphasis visited:text-color-text-low-emphasis">
          <icon class="top-nav-link__icon flex h-3 w-3 flex-shrink-0 " data-delayed-url="https://static.licdn.com/aero-v1/sc/h/5x5h6fkfoq2njo0ocxqr98mrk">
          </icon>
          <span class="top-nav-link__label-text font-sans text-sm leading-regular text-center
              font-regular">
            Discover
          </span>
        </a>
      
            </li>
            <li class>
              
        <a href="https://lk.linkedin.com/pub/dir/+/+?trk=public_profile_guest_nav_menu_people" data-tracking-control-name="public_profile_guest_nav_menu_people" data-tracking-will-navigate class="top-nav-link flex justify-center items-center h-[52px] hover:text-color-text visited:hover:text-color-text hover:no-underline
            w-[64px] flex-col mx-1
            top-nav-link--selected text-color-text visited:text-color-text border-solid border-b-2 border-color-text" aria-current="page">
          <icon class="top-nav-link__icon flex h-3 w-3 flex-shrink-0 " data-delayed-url="https://static.licdn.com/aero-v1/sc/h/7kb6sn3tm4cx918cx9a5jlb0">
          </icon>
          <span class="top-nav-link__label-text font-sans text-sm leading-regular text-center
              font-regular">
            People
          </span>
        </a>
      
            </li>
            <li class>
              
        <a href="https://lk.linkedin.com/learning/search?trk=public_profile_guest_nav_menu_learning" data-tracking-control-name="public_profile_guest_nav_menu_learning" data-tracking-will-navigate class="top-nav-link flex justify-center items-center h-[52px] hover:text-color-text visited:hover:text-color-text hover:no-underline
            w-[64px] flex-col mx-1
            text-color-text-low-emphasis visited:text-color-text-low-emphasis">
          <icon class="top-nav-link__icon flex h-3 w-3 flex-shrink-0 " data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8wykgzgbqy0t3fnkgborvz54u">
          </icon>
          <span class="top-nav-link__label-text font-sans text-sm leading-regular text-center
              font-regular">
            Learning
          </span>
        </a>
      
            </li>
            <li class>
              
        <a href="https://lk.linkedin.com/jobs/jobs-in-colombo?trk=public_profile_guest_nav_menu_jobs" data-tracking-control-name="public_profile_guest_nav_menu_jobs" data-tracking-will-navigate class="top-nav-link flex justify-center items-center h-[52px] hover:text-color-text visited:hover:text-color-text hover:no-underline
            w-[64px] flex-col mx-1
            text-color-text-low-emphasis visited:text-color-text-low-emphasis">
          <icon class="top-nav-link__icon flex h-3 w-3 flex-shrink-0 " data-delayed-url="https://static.licdn.com/aero-v1/sc/h/92eb1xekc34eklevj0io6x4ki">
          </icon>
          <span class="top-nav-link__label-text font-sans text-sm leading-regular text-center
              font-regular">
            Jobs
          </span>
        </a>
      
            </li>
        </ul>
      
    
          <div class="nav__cta-container order-3 flex gap-x-1 justify-end min-w-[100px] flex-nowrap flex-shrink-0 babybear:flex-wrap flex-2">
            
        
        <a class="nav__button-tertiary btn-md btn-tertiary" href="https://www.linkedin.com/signup/public-profile-join?vieweeVanityName=kekayan&amp;session_redirect=https%3A%2F%2Flk.linkedin.com%2Fin%2Fkekayan&amp;trk=public_profile_nav-header-join" data-tracking-control-name="public_profile_nav-header-join" data-test-live-nav-primary-cta data-tracking-will-navigate>
          Join now
        </a>
    
    
            
      
      
    
          
          <a class="nav__button-secondary btn-md btn-secondary-emphasis" href="https://www.linkedin.com/login?session_redirect=https%3A%2F%2Flk%2Elinkedin%2Ecom%2Fin%2Fkekayan&amp;fromSignIn=true&amp;trk=public_profile_nav-header-signin" data-tracking-control-name="public_profile_nav-header-signin" data-tracking-will-navigate>
              Sign in
          </a>
    
    
              <a aria-label="Sign in" class="nav__link-person papabear:hidden mamabear:hidden" data-tracking-control-name="public_profile_nav-header-signin" data-tracking-will-navigate href="https://www.linkedin.com/login?session_redirect=https%3A%2F%2Flk%2Elinkedin%2Ecom%2Fin%2Fkekayan&amp;fromSignIn=true&amp;trk=public_profile_nav-header-signin">
                
          <img class="inline-block relative
              rounded-[50%]
              w-4 h-4
              bg-color-entity-ghost-background" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt>
      
              </a>
          </div>
    
    <!---->
    <!---->    </nav>
      
          
        </header>
    
        
    <!---->      
    
    <!---->
        <main class="main papabear:flex papabear:w-content-max-w papabear:mx-auto papabear:pt-desktop-content-top-margin mamabear:pt-desktop-content-top-margin
            " id="main-content" role="main">
          <section class="core-rail mx-auto papabear:w-core-rail-width mamabear:max-w-[790px] babybear:max-w-[790px]">
            
            
          
    
            <div class="details mx-details-container-padding">
              
            
                
        
        
          <section class="profile">
            
    <!---->
          
        
        
        
        
        
        
        
        
        
        
        
    
        
        <section class="top-card-layout container-lined overflow-hidden babybear:rounded-[0px]">
            
        <figure class="cover-img min-h-[87px] papbear:min-h-[100px] rounded-t-[2px] babybear:rounded-[0px] -z-1">
    <!---->      <div class="cover-img__image-frame relative w-full overflow-hidden pb-[calc((134/782)*100%)]">
            <div class="cover-img__image-position absolute top-0 right-0 bottom-0 left-0
                ">
                <img class="cover-img__image relative w-full h-full object-cover" src="https://media.licdn.com/dms/image/C5116AQGRAGDi2-DziQ/profile-displaybackgroundimage-shrink_200_800/0/1529575267136?e=2147483647&amp;v=beta&amp;t=rA0f9s5pKtqLaDkOQkTjZTBr40HYwh21LiHWWFgiZYk" loading="lazy" data-embed-id="cover-image" alt>
            </div>
          </div>
    <!---->    </figure>
      
    
          <div class="top-card-layout__card relative p-2 papabear:p-details-container-padding">
                
            <div class="top-card__profile-image-container top-card__profile-image-container--cvw-fix
                top-card-layout__entity-image-container flex" data-section="picture">
              
          <img class="artdeco-entity-image artdeco-entity-image--circle-8
               top-card-layout__entity-image top-card__profile-image top-card__profile-image--real-image onload
                  top-card-layout__entity-image shadow-color-shadow shadow-[0_4px_12px] border-2 border-solid border-color-surface mt-[-70px] mb-[14px] papabear:border-4 papabear:mt-[-100px] papabear:mb-[18px]" data-delayed-url="https://media.licdn.com/dms/image/C5603AQHMqhLLTJzP2A/profile-displayphoto-shrink_800_800/0/1641108903285?e=2147483647&amp;v=beta&amp;t=AZ56v8Cx53N0ZbRHe7e-KGiHgx35FOCWtLXY1PCm1vI" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Kekayan Nanthakumar">
      
    <!---->        </div>
          
    
              <div class="top-card-layout__entity-info-container flex flex-wrap papabear:flex-nowrap">
                <div class="top-card-layout__entity-info flex-grow flex-shrink-0 basis-0 babybear:flex-none babybear:w-full babybear:flex-none babybear:w-full">
                      <h1 class="top-card-layout__title font-sans text-lg papabear:text-xl font-bold leading-open text-color-text mb-0">
                        Kekayan Nanthakumar
                        
    <!----><!---->      
                      </h1>
                    <h2 class="top-card-layout__headline break-words font-sans text-md leading-open text-color-text">
                        Senior Software Engineer at Insighture | 2x AWS | AWS SAA | AWS DVA | Serverless Enthusiast
                    </h2>
    
                    <h3 class="top-card-layout__first-subline font-sans text-md leading-open text-color-text-low-emphasis">
                      
              
        
        
        
    
          <div class="top-card__subline-item">Colombo, Western Province, Sri Lanka</div><span class="top-card__subline-item">
            758 followers
          </span><span class="top-card__subline-item top-card__subline-item--bullet">500+ connections</span>
      
                  
                    </h3>
    
    <!---->
                  <div class="top-card-layout__cta-container flex flex-wrap mt-0.5 papabear:mt-0 ml-[-12px]">
                        <a class="top-card-layout__cta mt-2 ml-1.5 h-auto babybear:flex-auto top-card-layout__cta--primary btn-md btn-primary" href="https://www.linkedin.com/signup/public-profile-join?vieweeVanityName=kekayan&amp;trk=public_profile_top-card-primary-button-join-to-view-profile" data-tracking-control-name="public_profile_top-card-primary-button-join-to-view-profile" data-tracking-will-navigate>
                          Join to view profile
                        </a>
                      
    <!---->              </div>
                </div>
    
                    <div class="top-card-layout__entity-info flex-grow flex-shrink-0 basis-0 babybear:flex-none babybear:w-full
                        top-card-layout__entity-info--right-column ml-details-container-padding max-w-[288px] babybear:my-2 babybear:ml-0">
                      
              <div class="top-card__links-container">
                  <div data-section="currentPositionsDetails" class="top-card__right-column-link top-card__position-info with-transition">
                    
          <a class="top-card-link top-card-link--link" href="https://lk.linkedin.com/company/insighture?trk=public_profile_topcard-current-company" target="_self" data-tracking-control-name="public_profile_topcard-current-company" data-tracking-will-navigate>
            
        
    
          
          <img class="artdeco-entity-image artdeco-entity-image--square-1
               top-card-link__logo" data-delayed-url="https://media.licdn.com/dms/image/C560BAQEN2IzLOGFYFA/company-logo_100_100/0/1613486083132?e=2147483647&amp;v=beta&amp;t=QNybgwgo9qp4rfHThjWdvgw_Snc0sJI7OtZB2mdObgc" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Insighture - We're hiring">
      
        <span class="top-card-link__description">
          Insighture - We're hiring<!---->    </span>
      
          </a>
      
                  </div>
    <!---->              <div data-section="educationsDetails" class="top-card__right-column-link top-card__education-info with-transition">
                    
          <a class="top-card-link top-card-link--link" href="https://lk.linkedin.com/school/university-of-kelaniya-sri-lanka/?trk=public_profile_topcard-school" target="_self" data-tracking-control-name="public_profile_topcard-school" data-tracking-will-navigate>
            
        
    
          
          <img class="artdeco-entity-image artdeco-entity-image--square-1
               top-card-link__logo" data-delayed-url="https://media.licdn.com/dms/image/C560BAQGTFCXTiB6wqA/company-logo_100_100/0/1519865292985?e=2147483647&amp;v=beta&amp;t=nhff6E7sS9pK76J7pgT8sVJlsheU4dys8d4S5kX0ZQ8" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" alt="University of Kelaniya Sri Lanka">
      
        <span class="top-card-link__description">
          University of Kelaniya Sri Lanka<!---->    </span>
      
          </a>
      
                  </div>
                  <div data-section="websites" class="top-card__right-column-link top-card__websites with-transition">
                    
        
    
            
          <a class="top-card-link top-card-link--link websites" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fkekayan%2Edev&amp;urlhash=Wkt9&amp;trk=public_profile_topcard-website" target="_blank" data-tracking-control-name="public_profile_topcard-website" data-tracking-will-navigate>
            
        
    
          <img data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9o8qqup6da04vhqijz8ft1j5g" class="top-card-link__logo top-card-link__logo--link-icon artdeco-entity-image artdeco-entity-image--square-1" alt="Personal Website" aria-hidden="true">
        <span class="top-card-link__description">
          Personal Website<img data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" class="websites__link-external-icon" alt="External link" aria-hidden="true">
        </span>
      
          </a>
      
      
                  </div>
              </div>
          
                    </div>
              </div>
    
              
    
        
        
        
        
        
        
        
        
        
        
        
        
        
    
          <div class="ellipsis-menu absolute right-0 top-0 top-card-layout__ellipsis-menu mr-1 papabear:mt-0.5 papabear:mr-2">
            
    
        
    
        <div class="collapsible-dropdown flex items-center relative hyphens-auto">
              
                <button class="ellipsis-menu__trigger
                    collapsible-dropdown__button btn-md btn-tertiary cursor-pointer
                    !py-[6px] !px-1 flex items-center rounded-[50%]
                    
                    " aria-expanded="false" aria-label="Open menu" data-tracking-control-name="public_profile_ellipsis-menu-trigger">
                  <icon class="ellipsis-menu__trigger-icon m-0 p-0 centered-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/671xosfpvk4c0kqtyl87hashi"></icon>
                </button>
              
    
            <ul class="collapsible-dropdown__list hidden container-raised absolute w-auto overflow-y-auto flex-col items-stretch z-1 bottom-auto top-[100%]" role="menu" tabindex="-1">
              
                  
    
                    <li class="ellipsis-menu__item border-t-1 border-solid border-color-border-low-emphasis first-of-type:border-none flex">
                      
    
        
        
    
        
    
        
    
        <a href="https://www.linkedin.com/uas/login?fromSignIn=true&amp;session_redirect=https%3A%2F%2Flk.linkedin.com%2Fin%2Fkekayan&amp;trk=public_profile_ellipsis-menu-semaphore-sign-in-redirect" data-tracking-control-name="public_profile_ellipsis-menu-semaphore-sign-in-redirect" data-tracking-will-navigate data-item-type="semaphore" data-semaphore-content-type="PROFILE" data-semaphore-content-urn="urn:li:nonIterableMember:ADoAABrY6f0BHfmffBcmRB3ZlwsUQGDHcfGuN3k" data-semaphore-tracking-prefix="public_profile_ellipsis-menu-semaphore" data-is-logged-in="false" data-modal="semaphore__toggle" class="semaphore__toggle visited:text-color-text-secondary ellipsis-menu__semaphore ellipsis-menu__item-button flex items-center w-full p-1 cursor-pointer font-sans text-sm font-bold link-styled focus:link-styled link:no-underline active:bg-color-background-container-tint focus:bg-color-background-container-tint hover:bg-color-background-container-tint outline-offset-[-2px]">
    <!---->        
                          <icon class="ellipsis-menu__item-icon text-color-text h-[24px] w-[24px] mr-1" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/iq0x9q37wj214o129ai1yjut">
                          </icon>
                          Report this profile
                        
        </a>
    
        
        
        
        
    
        
    
        
        <div class="hidden">
            <button class="modal__outlet " data-tracking-control-name="public_profile_ellipsis-menu-semaphore-modal_modal_outlet" data-modal="default-outlet">
              
            </button>
    
          <div id="semaphore-modal" class="modal semaphore-modal max-w-[744px] " data-outlet="default-outlet">
    <!---->        <div class="modal__overlay flex items-center bg-color-background-scrim justify-center fixed bottom-0 left-0 right-0 top-0 opacity-0 invisible pointer-events-none z-[1000] transition-[opacity] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.17s]
                py-4
                ">
              <section aria-modal="true" role="dialog" aria-labelledby="semaphore-modal-modal-header" tabindex="-1" class="max-h-full modal__wrapper overflow-auto p-0 bg-color-surface max-w-[1128px] min-h-[160px] relative scale-[0.25] shadow-sm shadow-color-border-faint transition-[transform] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.33s] focus:outline-0 rounded-md
                   modal__wrapper--with-footer flex flex-col
                  w-[1128px] mamabear:w-[744px] babybear:w-[360px]
                   max-w-[min(744px,100%-24px)]
                  ">
                  <header class="modal__header flex items-center justify-between border-b-1 border-solid border-color-border-faint py-1.5 px-3
                      ">
                      <h2 id="semaphore-modal-modal-header" class="modal__title font-normal leading-open text-color-text text-lg">Report</h2>
                      <button class="modal__dismiss modal__dismiss--with-icon btn-tertiary h-[40px] w-[40px] p-0 rounded-full indent-0
                          " aria-label="Dismiss" data-tracking-control-name="public_profile_ellipsis-menu-semaphore-modal_modal_dismiss" type="button">
                          <icon class="modal__dismiss-icon relative top-[2px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/gs508lg3t2o81tq7pmcgn6m2"></icon>
                      </button>
    <!---->              </header>
                <main class="modal__main w-full flex-1">
                  
            <h2 class="semaphore-modal__title text-md font-medium mb-1 ml-2 mt-2 text-color-text">
              Report<!-- semaphore title goes here -->
            </h2>
            <div class="semaphore-modal__content text-color-text"></div>
          
                </main>
    
                    <footer class="modal__footer flex justify-end py-1.5 px-3 border-t-1 border-solid border-color-border-faint">
                      
            <button class="btn-md btn-secondary" data-semaphore-action="back" data-tracking-control-name="semaphore-back">Back</button>
            <button class="btn-md btn-primary ml-1" data-semaphore-action="submit" data-tracking-control-name="semaphore-submit" disabled="true">Submit</button>
          
                    </footer>
              </section>
            </div>
          </div>
        </div>
      
      
        
        <template id="semaphore-container-template">
          <ul class="semaphore-options-container mb-2">
            <!-- list of semaphore options -->
          </ul>
        </template>
      
        
        <template id="semaphore-block-template">
          <li class="px-2 py-1" data-semaphore-item="action">
            <span class="text-sm text-color-text-low-emphasis whitespace-pre-line" data-attr="block-content"></span>
            <input class="hidden scale-150" data-tracking-control-name="public_profile_ellipsis-menu-semaphore" name="semaphore-action" checked value data-semaphore-input type="radio">
          </li>
        </template>
      
        
        <template id="semaphore-section-template">
          <li class="px-2 py-1" data-semaphore-item="section">
            <button class="w-full text-color-text" data-tracking-control-name="public_profile_ellipsis-menu-semaphore" data-semaphore-input>
              <span class="text-md text-left inline-block w-[calc(100%-24px)]" data-attr="title"></span>
              <icon class="float-right w-[24px] h-[24px] opacity-60" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/bib7g6ntpj66fbkg8zzh0psp2"></icon>
            </button>
          </li>
        </template>
      
        
        <template id="semaphore-openpage-template">
          <li class="px-2 py-1 border-t-1 border-solid border-color-border-faint" data-semaphore-item="openpage">
            <span class="text-md font-medium block my-1" data-attr="body"></span>
            <button data-tracking-control-name="public_profile_ellipsis-menu-semaphore" data-semaphore-input>
              <span class="text-md text-color-text" data-attr="title"></span>
            </button>
          </li>
        </template>
      
        
        <template id="semaphore-action-template">
          <li class="px-2 py-1" data-semaphore-item="action" data-semaphore-type>
            <span class="text-md font-medium inline-block my-1" data-attr="body"></span>
            <button class="w-full text-color-text" data-tracking-control-name="public_profile_ellipsis-menu-semaphore" data-semaphore-input>
              <span class="text-md text-left inline-block w-[calc(100%-24px)]" data-attr="title"></span>
              <icon class="float-right w-[24px] h-[24px] opacity-60" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/bib7g6ntpj66fbkg8zzh0psp2"></icon>
            </button>
          </li>
        </template>
      
        
        <template id="semaphore-action-radio-template">
          <li class="px-2 py-1" data-semaphore-item="action">
            <label>
              <div class="flex">
                <input class="scale-150" data-tracking-control-name="public_profile_ellipsis-menu-semaphore" name="semaphore-action" value data-semaphore-input type="radio">
                <span class="text-md inline-block ml-1" data-attr="title"></span>
              </div>
    
              <span class="text-sm text-left inline-block w-[calc(100%-24px)] opacity-60 pl-[30px]" data-attr="body"></span>
            </label>
          </li>
        </template>
      
        
        <template id="semaphore-openlink-template">
          <li class="px-2 py-1" data-semaphore-item="openlink">
            <a class="text-color-text hover:no-underline visited:text-color-text" data-semaphore-input data-tracking-control-name="public_profile_ellipsis-menu-semaphore" href target="_blank" data-tracking-will-navigate>
              <span class="text-md text-color-text font-normal inline-block" data-attr="title"></span>
              <span class="text-sm text-color-text font-normal inline-block w-[calc(100%-24px)] opacity-60" data-attr="body"></span>
              <icon class="float-right w-[24px] h-[24px] opacity-60" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/481psuouj1lu3q2laho6vqwhn"></icon>
            </a>
          </li>
        </template>
      
        
        <template id="semaphore-result-template">
          <p class="semaphore-options-container__item pl-2 pb-2" data-semaphore-item="result">
            <span class="text-sm font-normal text-color-text-secondary" data-attr="thanks-text-body"></span>
            <a class="text-sm font-semibold text-color-link" href="https://www.linkedin.com/help/linkedin/answer/37822" target="_blank" data-attr="thanks-help-center-link" data-tracking-control-name="public_profile_ellipsis-menu-semaphore-help-center" data-tracking-will-navigate data-semaphore-input></a>
          </p>
        </template>
      
      
                    </li>
    <!---->          
            </ul>
    
    <!---->    </div>
      
    
          </div>
      
    
    <!---->      </div>
        </section>
      
      
    
    <!---->
    <!---->
    <!---->
              
        
    
        
          
        <section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section summary" data-section="summary">
    <!---->
              
                <h2 class="core-section-container__title section-title">
                  
            About
          
                </h2>
            
            
    <!---->
          <div class="core-section-container__content break-words">
            
            <p>Senior Software Engineer with 2 years of experience in building products from scratch. Proven ability to design, build, debug and maintain complex software.  An energetic individual who's ready to take on any challenges and a constant learner.<br>My core skill set centered around Python, Node.js, and AWS. I am fluent with frameworks like Flask, Fast API, Django, Express, React and SpringBoot. In the infrastructure aspects, my skills range from Docker to AWS services. I have used docker-compose, Vault, AWS ECS, Lambda, SQS, S3, SES, and AWS SAM to name a few.<br>Also, I have used Pytorch and other NumPy, pandas, Matplotlib, and transformers libs.<br>I am capable of picking up new frameworks, infrastructure, and languages with ease.<br>As a Software Engineer now building next-generation NLP products to review contracts.<br><br>Get in touch!</p>
          
          </div>
        </section>
      
      
      
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!----><!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
              
        
        
        
        
        
        
        
        
        
    
        
          
        <section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section activities" data-section="posts">
    <!---->
              
                <h2 class="core-section-container__title section-title">
                  
            Activity
          
                </h2>
            
            
    <!---->
          <div class="core-section-container__content break-words">
            
            <ul>
                <li class="activities-section__item--posts">
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/pierrefdz_github-facebookresearchdinov2-pytorch-activity-7053808609943547904-y8IZ?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              🦖 Our team at Meta AI releases DINOv2: a family of foundation models producing high-performance visual features.
    
    Our models are trained entirely…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/sync/D5627AQHpNgqMB-8YTQ/articleshare-shrink_800/0/1681758808389?e=1682521200&amp;v=beta&amp;t=ZOuzGLliWF5U6MdUA6apiFmjAmdJs9JgI1mYY5cq7AI" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              🦖 Our team at Meta AI releases DINOv2: a family of foundation models producing high-performance visual features.
    
    Our models are trained entirely…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                </li>
                <li class="activities-section__item--posts">
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/andy-jassy-8b1615_announcing-new-tools-for-building-with-generative-activity-7052273103812362240-xPAI?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              Excited about our LLM / Generative AI announcements today. AWS is doing what it has for years and democratizing this technology so small and large…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/sync/D5627AQHl6jCZhCsHow/articleshare-shrink_800/0/1681882345746?e=1682521200&amp;v=beta&amp;t=RaUJcxMkbR4vqOVRpoR4Oh4FQT8ZrYgVz_cUfz9zqds" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              Excited about our LLM / Generative AI announcements today. AWS is doing what it has for years and democratizing this technology so small and large…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                </li>
                <li class="activities-section__item--posts">
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            hover:show-play-button focus:show-play-button
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/ruvishkagalhena_techforgood-techindustry-activity-7051551747412033537-oTPP?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              Celebrating religious and cultural diversity at Insighture 
    Diversity is the one true thing we all have in common and it is only right to celebrate…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  hover:show-play-button focus:show-play-button">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D5605AQE_TMubqHo3IA/videocover-low/0/1681220947743?e=2147483647&amp;v=beta&amp;t=aZZMRJfcnH3VODyGBweMqS4FKsaYyfv2OvSGFIUhBVc" alt>
          
                  <icon class="base-main-card__play-button w-auto overlay-center play-button" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9n9raq7fmdu241tpsxwodsmcd" data-svg-class-name="base-main-card__play-button-svg"></icon>
              </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              Celebrating religious and cultural diversity at Insighture 
    Diversity is the one true thing we all have in common and it is only right to celebrate…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                </li>
            </ul>
    
              <a class="activities-section__button" href="https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Flk%2Elinkedin%2Ecom%2Fin%2Fkekayan%2Frecent-activity%2F&amp;trk=public_profile_see-all-posts" data-tracking-control-name="public_profile_see-all-posts" data-tracking-will-navigate>
                Join now to see all activity
              </a>
                  
          </div>
        </section>
      
      
      
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!----><!---->
              
    
        
    
        
          
        <section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section experience">
    <!---->
              
                <h2 class="core-section-container__title section-title">
                  
            Experience
          
                </h2>
            
            
    <!---->
          <div class="core-section-container__content break-words">
            
            <ul class="experience__list">
                  
        
        
        
    
        
        
    
        <li class="profile-section-card  experience-item" data-section="currentPositionsDetails">
    <!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/insighture?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
                
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQEN2IzLOGFYFA/company-logo_100_100/0/1613486083132?e=2147483647&amp;v=beta&amp;t=QNybgwgo9qp4rfHThjWdvgw_Snc0sJI7OtZB2mdObgc" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Insighture - We&amp;#39;re hiring Graphic">
      
              </a>
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
            Senior Software Engineer
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/insighture?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
            Insighture - We're hiring
          
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              <p class="experience-item__duration experience-item__meta-item">
                
        
        
    
          <span class="date-range">
    <time>Mar 2022</time> - Present<span class="date-range__duration">1 year 2 months</span>
          </span>
      
              </p>
    
    <!---->
              <div class="experience-item__description experience-item__meta-item" data-section="currentPositions">
                
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            Led a team of engineers, developing a new product from scratch and maintaining the existing product.<br>Building a new product from scratch using serverless AWS services and NLP.<br>Architected and Deployed a fully serverless product.<br>Finetuned the Transformer based models for different downstream tasks.
    <!---->      </p>
    
    <!---->    </div>
      
              </div>
          
            </div>
          </div>
    
          
        </li>
      
      
                  
        
        
        
    
        
        
    
        <li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
    <!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/pearson-lanka?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
                
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C510BAQEzi0q6UFdpmQ/company-logo_100_100/0/1559022722199?e=2147483647&amp;v=beta&amp;t=CO4Of2n9IfS9X6BMSTytz5LeMsIu7ye9Oz6zW5YpBUk" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Pearson Lanka Graphic">
      
              </a>
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
            Software Engineer - Applied R &amp; D
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/pearson-lanka?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
            Pearson Lanka
          
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              <p class="experience-item__duration experience-item__meta-item">
                
        
        
    
          <span class="date-range">
    <time>Mar 2021</time> - <time>Mar 2022</time><span class="date-range__duration">1 year 1 month</span>
          </span>
      
              </p>
    
    <!---->
              <div class="experience-item__description experience-item__meta-item" data-section="pastPositions">
                
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            Implemented a time series forecasting service and deployed it in AWS Fargate.<br>Implemented a POC to demonstrate LTI launches & gradings from Google Classroom and Microsoft Education in SpringBoot with Google and Microsoft APIs.
    <!---->      </p>
    
    <!---->    </div>
      
              </div>
          
            </div>
          </div>
    
          
        </li>
      
      
                  
        
        
        
    
        
        
    
        <li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
    <!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/insighture?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
                
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQEN2IzLOGFYFA/company-logo_100_100/0/1613486083132?e=2147483647&amp;v=beta&amp;t=QNybgwgo9qp4rfHThjWdvgw_Snc0sJI7OtZB2mdObgc" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Insighture Graphic">
      
              </a>
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
            Software Engineer - ML &amp; AI
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/insighture?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
            Insighture
          
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              <p class="experience-item__duration experience-item__meta-item">
                
        
        
    
          <span class="date-range">
    <time>Aug 2020</time> - <time>Mar 2021</time><span class="date-range__duration">8 months</span>
          </span>
      
              </p>
    
    <!---->
              <div class="experience-item__description experience-item__meta-item" data-section="pastPositions">
                
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            As a lead python backend developer introduced NSW WWCC into the Weareoho platform which increased their coverage by 20% more.<br>Developed and evaluated a proof of concept model for detecting and parsing layouts with object detection using PyTorch and Detectron2.<br>Wrote a python library to receive webhooks in the terminal.
    <!---->      </p>
    
    <!---->    </div>
      
              </div>
          
            </div>
          </div>
    
          
        </li>
      
      
                  
        
        
        
    
        
        
    
        <li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
    <!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/pearson-lanka?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
                
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C510BAQEzi0q6UFdpmQ/company-logo_100_100/0/1559022722199?e=2147483647&amp;v=beta&amp;t=CO4Of2n9IfS9X6BMSTytz5LeMsIu7ye9Oz6zW5YpBUk" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Pearson Lanka Graphic">
      
              </a>
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
            Trainee Software Engineer - Applied Research and Development
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/pearson-lanka?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
            Pearson Lanka
          
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              <p class="experience-item__duration experience-item__meta-item">
                
        
        
    
          <span class="date-range">
    <time>Sep 2018</time> - <time>Sep 2019</time><span class="date-range__duration">1 year 1 month</span>
          </span>
      
              </p>
    
              <p class="experience-item__location experience-item__meta-item">
                Colombo
              </p>
    
              <div class="experience-item__description experience-item__meta-item" data-section="pastPositions">
                
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            Research on similarity search and Semantic Search from embeddings.<br>Created various POC for cloud migrations and ML Projects like Image Classification, NER and Text Classification.
    <!---->      </p>
    
    <!---->    </div>
      
              </div>
          
            </div>
          </div>
    
          
        </li>
      
      
                  
        
        
        
    
        
        
    
        <li class="profile-section-card  experience-item" data-section="pastPositionsDetails">
    <!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/company/bank-of-ceylon?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate>
                
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C4E0BAQGo8tnBeWXytg/company-logo_100_100/0/1519880917175?e=2147483647&amp;v=beta&amp;t=Vus9fl8BGG_nzacTz4qKOulP6Ujkfk7E2HIYqFgK5EU" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Bank of Ceylon Graphic">
      
              </a>
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
            Trainee
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/bank-of-ceylon?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
            Bank of Ceylon
          
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              <p class="experience-item__duration experience-item__meta-item">
                
        
        
    
          <span class="date-range">
    <time>Jan 2015</time> - <time>Jan 2016</time><span class="date-range__duration">1 year 1 month</span>
          </span>
      
              </p>
    
              <p class="experience-item__location experience-item__meta-item">
                Chavakachcheri
              </p>
    
    <!---->      
            </div>
          </div>
    
          
        </li>
      
      
            </ul>
          
          </div>
        </section>
      
      
      
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!----><!---->
    <!---->
              
        
    
        
          
        <section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section education" data-section="educationsDetails">
    <!---->
              
                <h2 class="core-section-container__title section-title">
                  
            Education
          
                </h2>
            
            
    <!---->
          <div class="core-section-container__content break-words">
            
            <ul class="education__list">
                
        
    
        
        
    
        <li class="profile-section-card  education__list-item" data-id="351255176">
    <!---->          <a class="profile-section-card__image-link" href="https://lk.linkedin.com/school/university-of-kelaniya-sri-lanka/?trk=public_profile_school_profile-section-card_image-click" data-tracking-control-name="public_profile_school_profile-section-card_image-click" data-tracking-will-navigate>
                
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQGTFCXTiB6wqA/company-logo_100_100/0/1519865292985?e=2147483647&amp;v=beta&amp;t=nhff6E7sS9pK76J7pgT8sVJlsheU4dys8d4S5kX0ZQ8" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" alt="University of Kelaniya Sri Lanka Graphic">
      
              </a>
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
              <a class="profile-section-card__title-link" href="https://lk.linkedin.com/school/university-of-kelaniya-sri-lanka/?trk=public_profile_school" data-tracking-control-name="public_profile_school" data-tracking-will-navigate>
                University of Kelaniya Sri Lanka
              </a>
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
              <span class="education__item education__item--degree-info">Bachelor’s Degree</span><span class="education__item education__item--degree-info" data-section="educations">BSc. (Hons) Software Engineering</span><span class="education__item education__item--degree-info" data-section="educations">First Class</span>
          
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
            <p class="education__item education__item--duration">
              
        
        
    
          <span class="date-range">
    <time>2016</time> - <time>2020</time><!---->      </span>
      
            </p>
    
              <div class="education__item--details" data-section="educations">
                  <p class="education__item education__item--activities-and-societies">
                    Activities and Societies: Committee member of Young Computing Professional's Society (YCPT) (2016)
                  </p>
                  
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            CGPA 3.89/4.00
    <!---->      </p>
    
    <!---->    </div>
      
              </div>
          
            </div>
          </div>
    
          
        </li>
      
      
                
        
    
        
        
    
        <li class="profile-section-card  education__list-item" data-id="373986937">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
              artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" alt="Hindu College, Chavakachcheri Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
              Hindu College, Chavakachcheri
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
              <span class="education__item education__item--degree-info">High School</span><span class="education__item education__item--degree-info" data-section="educations">Physical Sciences (2014 A/L)</span><!---->      
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
            <p class="education__item education__item--duration">
              
        
        
    
          <span class="date-range">
    <time>2004</time> - <time>2014</time><!---->      </span>
      
            </p>
    
              <div class="education__item--details" data-section="educations">
                  <p class="education__item education__item--activities-and-societies">
                    Activities and Societies: Mathematic Club - Committee Member
                  </p>
                  
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            G.C.E. (Advance Level Examination) - 2014 (Physical Science Stream)<br>         Combined Mathematics A<br>         Chemistry A<br>         Physics B<br>         General English C<br>         Z Score 1.8472
    <!---->      </p>
    
    <!---->    </div>
      
              </div>
          
            </div>
          </div>
    
          
        </li>
      
      
            </ul>
          
          </div>
        </section>
      
      
      
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!----><!---->
    <!---->
    <!---->
              
    
        
        
        
        
        
        
    
        
          
        <section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section certifications" data-section="certifications">
    <!---->
              
                <h2 class="core-section-container__title section-title">
                  
            Licenses & Certifications
          
                </h2>
            
            
    <!---->
          <div class="core-section-container__content break-words">
            
            <ul class="certifications__list">
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQER_QnUTXrPJw/company-logo_100_100/0/1670264050886?e=2147483647&amp;v=beta&amp;t=HLcQIlrpl-zFH0Uin0PaCqfCfI-6E8zg6_suQn-7bGQ" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="AWS Learning: Serverless Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecredly%2Ecom%2Fbadges%2Fe5c148a7-1370-4932-90b6-75197f244142%2Flinked_in_profile&amp;urlhash=S8jH&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        AWS Learning: Serverless
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/amazon-web-services?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    Amazon Web Services (AWS)
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>Dec 2022</time>
                        </span>
    <!---->                  </div>
    
    <!---->
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecredly%2Ecom%2Fbadges%2Fe5c148a7-1370-4932-90b6-75197f244142%2Flinked_in_profile&amp;urlhash=S8jH&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQEHKffoI8RwIQ/company-logo_100_100/0/1612806383093?e=2147483647&amp;v=beta&amp;t=vrGYI9kWHQ_27E7kageqeOXCJ0kqzvUHCbxZUcVYPow" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Convolutional Neural Networks in TensorFlow Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecoursera%2Eorg%2Faccount%2Faccomplishments%2Frecords%2F2LBETK9T5H6X%3Futm_source%3Dlink%26utm_medium%3Dcertificate%26utm_content%3Dcert_image%26utm_campaign%3Dsharing_cta%26utm_product%3Dcourse&amp;urlhash=4dOo&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        Convolutional Neural Networks in TensorFlow
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/deeplearningai?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    deeplearning.ai
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>May 2020</time>
                        </span>
    <!---->                  </div>
    
    <!---->
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecoursera%2Eorg%2Faccount%2Faccomplishments%2Frecords%2F2LBETK9T5H6X%3Futm_source%3Dlink%26utm_medium%3Dcertificate%26utm_content%3Dcert_image%26utm_campaign%3Dsharing_cta%26utm_product%3Dcourse&amp;urlhash=4dOo&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C4D0BAQGexnfBxeEG-g/company-logo_100_100/0/1608039227697?e=2147483647&amp;v=beta&amp;t=XPIN_zBKBmgWp_N9EDiww52RGQcHN2dDRHL1u_Ir61w" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Getting Started with AWS Machine Learning
    
     Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecoursera%2Eorg%2Faccount%2Faccomplishments%2Fcertificate%2FY56E6CQDYP6F&amp;urlhash=UDjt&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        Getting Started with AWS Machine Learning
    
    
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/coursera?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    Coursera
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>Apr 2020</time>
                        </span>
    <!---->                  </div>
    
                      <div class="certifications__credential-id">
                        Credential ID Y56E6CQDYP6F
                      </div>
    
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecoursera%2Eorg%2Faccount%2Faccomplishments%2Fcertificate%2FY56E6CQDYP6F&amp;urlhash=UDjt&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQEHKffoI8RwIQ/company-logo_100_100/0/1612806383093?e=2147483647&amp;v=beta&amp;t=vrGYI9kWHQ_27E7kageqeOXCJ0kqzvUHCbxZUcVYPow" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Introduction to TensorFlow for Artificial Intelligence, Machine Learning, and Deep Learning Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fcoursera%2Eorg%2Fshare%2F96f5528fc5ae53a7ff716a0d89f9a65e&amp;urlhash=nAT9&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        Introduction to TensorFlow for Artificial Intelligence, Machine Learning, and Deep Learning
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/deeplearningai?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    deeplearning.ai
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>Apr 2020</time>
                        </span>
    <!---->                  </div>
    
    <!---->
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fcoursera%2Eorg%2Fshare%2F96f5528fc5ae53a7ff716a0d89f9a65e&amp;urlhash=nAT9&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C4D0BAQEw5aWYBeGnXg/company-logo_100_100/0/1633943472086?e=2147483647&amp;v=beta&amp;t=yjty-qCNXs0kPXmJ-jzU7Sw-dzNHYGVJOcNgjbV0230" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Git and GitHub Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      Git and GitHub
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/365datascience?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    365 Data Science
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>Mar 2020</time>
                        </span>
    <!---->                  </div>
    
                      <div class="certifications__credential-id">
                        Credential ID #cert_99rml64y
                      </div>
    
    <!---->              
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C4E0BAQFfDMello2Gtg/company-logo_100_100/0/1519856598122?e=2147483647&amp;v=beta&amp;t=xLrng2vAtaSVSOq02U3tWo_tHwmPKredu0lfUcFuaIM" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Machine Learning &amp;amp; AI Foundations: Value Estimations Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=http%3A%2F%2Fwww%2Elynda%2Ecom%2FData-Science-tutorials%2FMachine-Learning-Essential-Training-Value-Estimations%2F548594-2%2Ehtml&amp;urlhash=5lGE&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        Machine Learning &amp; AI Foundations: Value Estimations
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/lynda-com?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    Lynda.com
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>Sep 2018</time>
                        </span>
    <!---->                  </div>
    
    <!---->
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=http%3A%2F%2Fwww%2Elynda%2Ecom%2FData-Science-tutorials%2FMachine-Learning-Essential-Training-Value-Estimations%2F548594-2%2Ehtml&amp;urlhash=5lGE&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQEHKffoI8RwIQ/company-logo_100_100/0/1612806383093?e=2147483647&amp;v=beta&amp;t=vrGYI9kWHQ_27E7kageqeOXCJ0kqzvUHCbxZUcVYPow" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Neural Networks and Deep Learning Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecoursera%2Eorg%2Faccount%2Faccomplishments%2Fverify%2FFM2LAKBFKF5L&amp;urlhash=l4oc&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        Neural Networks and Deep Learning
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/deeplearningai?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    deeplearning.ai
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>Apr 2018</time>
                        </span>
    <!---->                  </div>
    
                      <div class="certifications__credential-id">
                        Credential ID FM2LAKBFKF5L
                      </div>
    
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecoursera%2Eorg%2Faccount%2Faccomplishments%2Fverify%2FFM2LAKBFKF5L&amp;urlhash=l4oc&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
              artdeco-entity-image--ghost profile-section-card__image" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Intro to Python for Data Science Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Edatacamp%2Ecom%2Fstatement-of-accomplishment%2Fcourse%2F8cdb353f918167d7a61f973becda3320d2e3f748&amp;urlhash=UydY&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        Intro to Python for Data Science
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
                    www.datacamp.com
                  
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>Feb 2018</time>
                        </span>
    <!---->                  </div>
    
                      <div class="certifications__credential-id">
                        Credential ID 4,625,344
                      </div>
    
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Edatacamp%2Ecom%2Fstatement-of-accomplishment%2Fcourse%2F8cdb353f918167d7a61f973becda3320d2e3f748&amp;urlhash=UydY&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQHaVYd13rRz3A/company-logo_100_100/0/1638831589865?e=2147483647&amp;v=beta&amp;t=fi3iyTgSAogCMgSmAy_DeyogJxzo38RVBK0mcEuSpc8" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Learning Java Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Flearning%2Fcertificates%2Fa5df184644fafed224f5805601d9a24c7b420267e86f90200e3e98e2f7804921%3Ftrk%3Dbackfilled_certificate&amp;urlhash=Uwhy&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        Learning Java
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/linkedin?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    LinkedIn
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>Nov 2017</time>
                        </span>
    <!---->                  </div>
    
                      <div class="certifications__credential-id">
                        Credential ID AcYg_9LG5-4qlrTwRON1la6CEAkz
                      </div>
    
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Flearning%2Fcertificates%2Fa5df184644fafed224f5805601d9a24c7b420267e86f90200e3e98e2f7804921%3Ftrk%3Dbackfilled_certificate&amp;urlhash=Uwhy&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQER_QnUTXrPJw/company-logo_100_100/0/1670264050886?e=2147483647&amp;v=beta&amp;t=HLcQIlrpl-zFH0Uin0PaCqfCfI-6E8zg6_suQn-7bGQ" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="AWS Certified Developer – Associate Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecredly%2Ecom%2Fbadges%2Fa24df389-c1fc-4b99-86ac-4012aa07ecd7%3Fsource%3Dlinked_in_profile&amp;urlhash=-ghg&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        AWS Certified Developer – Associate
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/amazon-web-services?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    Amazon Web Services (AWS)
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>Dec 2021</time>
                        </span>
                          <span class="certifications__end-date">
                            Expires <time>Dec 2024</time>
                          </span>
                      </div>
    
    <!---->
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecredly%2Ecom%2Fbadges%2Fa24df389-c1fc-4b99-86ac-4012aa07ecd7%3Fsource%3Dlinked_in_profile&amp;urlhash=-ghg&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQER_QnUTXrPJw/company-logo_100_100/0/1670264050886?e=2147483647&amp;v=beta&amp;t=HLcQIlrpl-zFH0Uin0PaCqfCfI-6E8zg6_suQn-7bGQ" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="AWS Certified Solutions Architect – Associate Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecredly%2Ecom%2Fearner%2Fearned%2Fbadge%2F5f13f94a-b1ec-4f03-acd9-238df9c40ae0&amp;urlhash=kQUm&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        AWS Certified Solutions Architect – Associate
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/amazon-web-services?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    Amazon Web Services (AWS)
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                      <div class="certifications__date-range">
                        <span class="certifications__start-date">
                          Issued <time>Oct 2021</time>
                        </span>
                          <span class="certifications__end-date">
                            Expires <time>Oct 2024</time>
                          </span>
                      </div>
    
    <!---->
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecredly%2Ecom%2Fearner%2Fearned%2Fbadge%2F5f13f94a-b1ec-4f03-acd9-238df9c40ae0&amp;urlhash=kQUm&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!---->          
          <img class="artdeco-entity-image artdeco-entity-image--square-4
               profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQEHKffoI8RwIQ/company-logo_100_100/0/1612806383093?e=2147483647&amp;v=beta&amp;t=vrGYI9kWHQ_27E7kageqeOXCJ0kqzvUHCbxZUcVYPow" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="Natural Language Processing in TensorFlow  Graphic" aria-hidden="true">
      
    
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                      <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecoursera%2Eorg%2Faccount%2Faccomplishments%2Fcertificate%2FMXLVRU9F2HT9&amp;urlhash=jwsF&amp;trk=public_profile_certification-title" data-tracking-control-name="public_profile_certification-title" data-tracking-will-navigate>
                        Natural Language Processing in TensorFlow 
                      </a>
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  <a class="profile-section-card__subtitle-link" href="https://lk.linkedin.com/company/deeplearningai?trk=public_profile_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_profile-section-card_subtitle-click" data-tracking-will-navigate>
                    
                    deeplearning.ai
                  
                  </a>
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
    <!---->
                      <div class="certifications__credential-id">
                        Credential ID MXLVRU9F2HT9
                      </div>
    
                      <div class="certifications__external-link">
                        <a class="certifications__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fwww%2Ecoursera%2Eorg%2Faccount%2Faccomplishments%2Fcertificate%2FMXLVRU9F2HT9&amp;urlhash=jwsF&amp;trk=public_profile_see-credential" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_see-credential" data-tracking-will-navigate>
                          See credential<img class="certifications__button-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
                        </a>
                      </div>
                  
            </div>
          </div>
    
          
        </li>
      
            </ul>
          
          </div>
        </section>
      
      
      
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!----><!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
              
        
    
        
          
        <section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section projects" data-section="projects">
    <!---->
              
                <h2 class="core-section-container__title section-title">
                  Projects
                </h2>
            
            
    <!---->
          <div class="core-section-container__content break-words">
            
            <ul class="projects__list">
                
    
        
        
        
        
        
        
        
    
        
        
    
        <li class="profile-section-card  personal-project">
    <!----><!---->
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
              <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fweareoho%2Ecom&amp;urlhash=8UCp&amp;trk=public_profile_project-title" title="Oho  formerly dutyof.care" rel="nofollow" data-tracking-control-name="public_profile_project-title" data-tracking-will-navigate>
                Oho  formerly dutyof.care
              </a>
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
            
                      
        
        
    
          <span class="date-range">
    <time>Nov 2020</time> - Present<!---->      </span>
      
                  
          
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            Part of the team developed the NSW feature, in the dutyof.care platform a highly scalable, resilient product.<br>Involved and implemented backend microservices in python-flask and nodejs involved with RabbitMQ, REDIS, PostgreSQL. <br>Experienced in docker, docker-compose, Hashicorp Vault, AWS Lambda, S3, SES, code build-deploy-pipeline.
    <!---->      </p>
    
    <!---->    </div>
      
    <!---->          <a class="personal-project__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fweareoho%2Ecom&amp;urlhash=8UCp&amp;trk=public_profile_project-button" title="Oho  formerly dutyof.care" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_project-button" data-tracking-will-navigate>
                See project<img class="personal-project__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
              </a>
          
            </div>
          </div>
    
          
        </li>
      
      
                
    
        
        
        
        
        
        
        
    
        
        
    
        <li class="profile-section-card  personal-project">
    <!----><!---->
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
              <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fneo%2Epearson%2Ecom%2Fgroups%2Fsl-rd%2Fblog%2F2019%2F05%2F13%2Fanomaly-detection-with-aws-services&amp;urlhash=xtM8&amp;trk=public_profile_project-title" title="Anomaly Detection On ELB logs" rel="nofollow" data-tracking-control-name="public_profile_project-title" data-tracking-will-navigate>
                Anomaly Detection On ELB logs
              </a>
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
            
                      
        
        
    
          <span class="date-range">
              <time>
                Feb 2019
              </time>
          </span>
      
                  
          
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            A pipeline to detect anomalies  on real-time ELB logs using Amazon Kinesis Data Analytics with Random Cut Forest Algorithm & created a fake ELB log generator as part of it
    <!---->      </p>
    
    <!---->    </div>
      
    <!---->          <a class="personal-project__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fneo%2Epearson%2Ecom%2Fgroups%2Fsl-rd%2Fblog%2F2019%2F05%2F13%2Fanomaly-detection-with-aws-services&amp;urlhash=xtM8&amp;trk=public_profile_project-button" title="Anomaly Detection On ELB logs" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_project-button" data-tracking-will-navigate>
                See project<img class="personal-project__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
              </a>
          
            </div>
          </div>
    
          
        </li>
      
      
                
    
        
        
        
        
        
        
        
    
        
        
    
        <li class="profile-section-card  personal-project">
    <!----><!---->
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
              APSES
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
            
                      
        
        
    
          <span class="date-range">
    <time>Sep 2018</time> - <time>Oct 2018</time><!---->      </span>
      
                  
          
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            Research-based project done under Pearson Lanka (Pvt.) Ltd. related to Machine Learning and Deep Learning, specializing in Image Processing. Used Python, TensorFlow, MXNet, Flask, Gunicorn, Nginx, Ansible.
    <!---->      </p>
    
    <!---->    </div>
      
              <div class="personal-project__contributors-heading">Other creators</div>
              
        <ul class="face-pile__list personal-project__contributors">
    <li class="face-pile__list-item">
                <a href="https://nz.linkedin.com/in/savindi?trk=public_profile_project_contributor-image" class="face-pile__url" title="Savindi Wijenayaka" data-tracking-control-name="public_profile_project_contributor-image" data-tracking-will-navigate>
                  
          <img class="artdeco-entity-image artdeco-entity-image--circle-3
               face-pile__profile-photo" data-delayed-url="https://media.licdn.com/dms/image/C5603AQEJ1IVfuSBIlQ/profile-displayphoto-shrink_100_100/0/1660090169131?e=1687392000&amp;v=beta&amp;t=gQ-t8TpOkQwnK3dyDyFAKmxOf5zApGPTmYCS2D7F-vc" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Savindi Wijenayaka">
      
                </a>
            </li>    </ul>
      
    <!---->      
            </div>
          </div>
    
          
        </li>
      
      
                
    
        
        
        
        
        
        
        
    
        
        
    
        <li class="profile-section-card  personal-project">
    <!----><!---->
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
              <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fneo%2Epearson%2Ecom%2Fgroups%2Fsl-rd%2Fblog%2F2019%2F05%2F02%2Fsynonyms&amp;urlhash=k9Ji&amp;trk=public_profile_project-title" title="Synonyms Extraction" rel="nofollow" data-tracking-control-name="public_profile_project-title" data-tracking-will-navigate>
                Synonyms Extraction
              </a>
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
            
                      
        
        
    
          <span class="date-range">
              <time>
                Sep 2018
              </time>
          </span>
      
                  
          
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            NLP based experiments.
    <!---->      </p>
    
    <!---->    </div>
      
    <!---->          <a class="personal-project__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fneo%2Epearson%2Ecom%2Fgroups%2Fsl-rd%2Fblog%2F2019%2F05%2F02%2Fsynonyms&amp;urlhash=k9Ji&amp;trk=public_profile_project-button" title="Synonyms Extraction" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_project-button" data-tracking-will-navigate>
                See project<img class="personal-project__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
              </a>
          
            </div>
          </div>
    
          
        </li>
      
      
                
    
        
        
        
        
        
        
        
    
        
        
    
        <li class="profile-section-card  personal-project">
    <!----><!---->
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
              <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fitunes%2Eapple%2Ecom%2Fus%2Fapp%2Fiwl-haulage-tariff%2Fid1253912040%3Fmt%3D8%26ign-mpt%3Duo%253D4&amp;urlhash=rpbv&amp;trk=public_profile_project-title" title="IWL Haulage Tariff - IOS App" rel="nofollow" data-tracking-control-name="public_profile_project-title" data-tracking-will-navigate>
                IWL Haulage Tariff - IOS App
              </a>
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
            
                      
        
        
    
          <span class="date-range">
              <time>
                Aug 2017
              </time>
          </span>
      
                  
          
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            Project for Inter world Logistics (M) sdn.bhd <br>
    <!---->      </p>
    
    <!---->    </div>
      
    <!---->          <a class="personal-project__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fitunes%2Eapple%2Ecom%2Fus%2Fapp%2Fiwl-haulage-tariff%2Fid1253912040%3Fmt%3D8%26ign-mpt%3Duo%253D4&amp;urlhash=rpbv&amp;trk=public_profile_project-button" title="IWL Haulage Tariff - IOS App" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_project-button" data-tracking-will-navigate>
                See project<img class="personal-project__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
              </a>
          
            </div>
          </div>
    
          
        </li>
      
      
                
    
        
        
        
        
        
        
        
    
        
        
    
        <li class="profile-section-card  personal-project">
    <!----><!---->
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
              <a class="profile-section-card__title-link" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fplay%2Egoogle%2Ecom%2Fstore%2Fapps%2Fdetails%3Fid%3Dmy%2Ecom%2Einterworldlogistics%2Eiwlhaulagetariff&amp;urlhash=gxqb&amp;trk=public_profile_project-title" title="IWL Haulage Tariff - Android App" rel="nofollow" data-tracking-control-name="public_profile_project-title" data-tracking-will-navigate>
                IWL Haulage Tariff - Android App
              </a>
          
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
            
                      
        
        
    
          <span class="date-range">
              <time>
                Jul 2017
              </time>
          </span>
      
                  
          
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
              
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            Project developed for Inter world Logistics (M) sdn.bhd (http://interworldlogistics.com.my) on Android <br>Technologies-Android SDK , MYSQL ,PHP
    <!---->      </p>
    
    <!---->    </div>
      
    <!---->          <a class="personal-project__button" href="https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fplay%2Egoogle%2Ecom%2Fstore%2Fapps%2Fdetails%3Fid%3Dmy%2Ecom%2Einterworldlogistics%2Eiwlhaulagetariff&amp;urlhash=gxqb&amp;trk=public_profile_project-button" title="IWL Haulage Tariff - Android App" rel="nofollow" target="_blank" data-tracking-control-name="public_profile_project-button" data-tracking-will-navigate>
                See project<img class="personal-project__link-external-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8w0vew433o9nluoruq9k5eqy" alt="External link" aria-hidden="true" data-tracking-will-navigate>
              </a>
          
            </div>
          </div>
    
          
        </li>
      
      
            </ul>
          
          </div>
        </section>
      
      
      
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!----><!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
              
        
    
        
          
        <section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section awards" data-section="awards">
    <!---->
              
                <h2 class="core-section-container__title section-title">
                  
            Honors & Awards
          
                </h2>
            
            
    <!---->
          <div class="core-section-container__content break-words">
            
            <ul class="awards__list">
                
        
    
        <li class="profile-section-card ">
    <!----><!---->
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                    National Youth Hackathon : Hackadev 2017
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
                    Ministry of Telecommunication and Digital Infrastructure of Sri Lanka.
                  
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                    
        
        
    
          <span class="date-range">
              <time>
                Oct 2017
              </time>
          </span>
      
                      
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            1st Runners Up : Team Paradox <br>I lead the team Paradox with amazing member @savindi , @Sevindu , @Sathiyakugan & @Nitheesram
    <!---->      </p>
    
    <!---->    </div>
      
                  
            </div>
          </div>
    
          
        </li>
      
                
        
    
        <li class="profile-section-card ">
    <!----><!---->
          <div class="profile-section-card__contents">
            <h3 class="profile-section-card__title">
              
                    Ahasi-2016 Annual Art Day
                  
            </h3>
    
              <h4 class="profile-section-card__subtitle">
                  
                    Kala Kavaya University of Kelaniya
                  
              </h4>
    
            
    
            <div class="profile-section-card__meta">
              
                    
        
        
    
          <span class="date-range">
              <time>
                Oct 2016
              </time>
          </span>
      
                      
        <div class="show-more-less-text">
          <p class="show-more-less-text__text--less">
            1st Place in Photography Competition
    <!---->      </p>
    
    <!---->    </div>
      
                  
            </div>
          </div>
    
          
        </li>
      
            </ul>
          
          </div>
        </section>
      
      
      
    
    <!----><!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
              
    
        
        
        
        
        
        
        
        
        
    
        
          
        <section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section recommendations" data-section="recommendations">
    <!---->
              
                <h2 class="core-section-container__title section-title">
                  
            Recommendations received
          
                </h2>
            
            
    <!---->
          <div class="core-section-container__content break-words">
            
            
        
        
    
          <ul class="show-more-less__list show-more-less__list--no-hidden-elems" data-impression-id="public_profile_show-more-less">
            
                  <li class="recommendations__list-item">
                    
        <div class="endorsement-card flex flex-col">
            
            
              
        
        
    
        
        
        
          <a href="https://de.linkedin.com/in/hiran-dissanayake-43025453?trk=public_profile_recommendations" target="_self" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link endorsement-card__entity">
            
    
    <!---->
          
              
          <img class="inline-block relative
              rounded-[50%]
              w-6 h-6
              bg-color-entity-ghost-background" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" alt="Click here to view Hiran Dissanayake’s profile">
      
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
            Hiran Dissanayake
    
    <!---->      
              </h3>
              
    
    <!---->
    <!---->
                  <div class="body-text text-color-text-low-emphasis base-main-card__metadata">
                    
            
                  
      
    
          <p class="endorsement-card__content body-text text-color-text-low-emphasis">
              &ldquo;Kekayan is one of the brightest research interns I have met, who has a wide range of knowledge in machine learning and other data science perspectives. I had the pleasure of leading him in several research and projects during his one-year internship at Pearson Lanka. He always investigates new trends and technologies for data science by continuously updating himself and even the team, on applying new technologies. One of the best quality which I admire from Kekayan is his dedication to a given task and how he tries to come up with error-proof solutions thinking outside of the box with &quot;can-do&quot; mindset. He has got a very strong work ethic and unparalleled analytical and problem-solving skills. He makes the team atmosphere friendly and easy to work, despite being a shy individual himself. Even though his interest lies in data science, I see a full-stack developer in him, who can come up with simple yet beautiful front end designs as well. I definitely would recommend him as a valuable asset to any organization&rdquo;
          </p>
    
    
                
          
                  </div>
            </div>
    
    <!---->      
        
          </a>
      
      
      
      
        </div>
      
                  </li>
              
          </ul>
      
    
            <p class="recommendations__cta">
              <span class="recommendations__count">
                1 person has recommended Kekayan
              </span>
    
              <a class="recommendations__cta-link" href="https://www.linkedin.com/signup/public-profile-join?vieweeVanityName=kekayan&amp;trk=public_profile_recommendations" data-tracking-control-name="public_profile_recommendations" data-tracking-will-navigate>
                  Join now to view
              </a>
            </p>
          
          </div>
        </section>
      
      
      
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
              
    
        
        
        
        
    
        
    
          
          
        <section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section recommended-content" data-section="posts">
    <!---->
              
                <h2 class="core-section-container__title section-title">
                  
              More activity by Kekayan
            
                </h2>
            
            
    <!---->
          <div class="core-section-container__content break-words">
            
                <ul class="recommended-content__list">
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            hover:show-play-button focus:show-play-button
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/arteculateasia_insighture-outing-activity-7048879730929852416-jFM8?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              Insighture celebrates the heart of #peoplefirstculture in everything they do as they believe that happy and fulfilled employees are the key to…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  hover:show-play-button focus:show-play-button">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D4D05AQGv3UGUfK6RFw/videocover-low/0/1680583856362?e=2147483647&amp;v=beta&amp;t=gwGaAMoOgXqJbbYDXtp5vr8CLXEsEk-NINuo8xmw1ks" alt>
          
                  <icon class="base-main-card__play-button w-auto overlay-center play-button" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9n9raq7fmdu241tpsxwodsmcd" data-svg-class-name="base-main-card__play-button-svg"></icon>
              </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              Insighture celebrates the heart of #peoplefirstculture in everything they do as they believe that happy and fulfilled employees are the key to…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/niels-rogge-a3b7a3127_ai-documentai-artificialintelligence-activity-7046142813742198784-vg3g?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              During this GPT hype, at 🤗 Hugging Face we're committed to keep open-sourcing powerful AI models instead of holding them behind closed doors/APIs…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/D4E22AQEgYj61KINq-w/feedshare-shrink_800/0/1679931356451?e=2147483647&amp;v=beta&amp;t=0EfsuaRkpKFyHUNNrIPqC0UpmV5w600WEVIj4wFLibU" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              During this GPT hype, at 🤗 Hugging Face we're committed to keep open-sourcing powerful AI models instead of holding them behind closed doors/APIs…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/weareoho_weareoho-safersociety-accreditationcompliance-activity-7043438536850649089-UWYA?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              Oho is comitted to safeguarding our communities with our revolutionary technology solution. We've hit 5 Million accreditations! Keeping your people…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/C4D10AQHifXilwZ_1BA/image-shrink_800/0/1679286601624?e=1682521200&amp;v=beta&amp;t=slb1UmjaRopehqS5KDru6kKQw4JIbCOT4jfnU4EiXB0" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              Oho is comitted to safeguarding our communities with our revolutionary technology solution. We've hit 5 Million accreditations! Keeping your people…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/ruvishkagalhena_ending-an-eventful-week-at-insighturehere-activity-7042485586250665984-qd5B?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              Ending an eventful week at Insighture…here’s to the weekend and an epic week ahead!
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/C5622AQFi2_P9RXXmnw/feedshare-shrink_800/0/1679059406098?e=2147483647&amp;v=beta&amp;t=FwAshz-OBYl0OEMGFMq_P05ueGv2acwI4GE6WhSiklo" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              Ending an eventful week at Insighture…here’s to the weekend and an epic week ahead!
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/shenell-sowmiya-thanabalasingham-5321221b0_masterofbusinessadministration-activity-7041677781490958336-m6mH?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              MBA🎓✨University of Northampton #masterofbusinessadministration
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/C5622AQGUghDERb46Lw/feedshare-shrink_800/0/1678866810328?e=2147483647&amp;v=beta&amp;t=vLUXYSH8r1VsL7FXm_9TWhKpo--eZm9SsuCcG9Z3nR0" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              MBA🎓✨University of Northampton #masterofbusinessadministration
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/markkurtzjr_2022-state-of-competitive-mlthe-downfall-activity-7040667755661991936-GIFe?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              It's shocking to see just how far TensorFlow has fallen. The 2022 state of competitive machine learning report came out recently and paints a very…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/sync/D5627AQE9B0imoCSu-A/articleshare-shrink_800/0/1681873872407?e=1682521200&amp;v=beta&amp;t=RE6K6_2bscPI1EfGsqLG0C0dU3FsHbcUjhux_vsXmAQ" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              It's shocking to see just how far TensorFlow has fallen. The 2022 state of competitive machine learning report came out recently and paints a very…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/jeevandongre_the-serverless-first-strategy-experience-activity-7039553461864062976-8VNv?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              The document helps to burst many myths about serverless and how enterprises can adopt and benefit from them. 
    Great post by George Mao, Capital…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/sync/D4E27AQEWO9oPI9z4LQ/articleshare-shrink_800/0/1680780854661?e=1682521200&amp;v=beta&amp;t=j3NT3TBbrLMVmUi8nDceQEVMQygncO1oF686-KXe0Us" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              The document helps to burst many myths about serverless and how enterprises can adopt and benefit from them. 
    Great post by George Mao, Capital…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/nathan-ross-adams-a5760b9a_i-love-practical-ways-to-protect-privacy-activity-7037326851974803457-2GoB?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              I love practical ways to protect privacy. Here’s an example of privacy by design in practice. At an event, the organisers created red lanyards for…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/C4D22AQFbAtKW0HgfTw/feedshare-shrink_800/0/1677829468111?e=2147483647&amp;v=beta&amp;t=0XyVEuaEy2nl0Csu_GnxWbqzaUm6milnI8RFUJkf12E" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              I love practical ways to protect privacy. Here’s an example of privacy by design in practice. At an event, the organisers created red lanyards for…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/arslanahmad_systemdesign-interview-architecture-activity-7036157889601818624-LF_3?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              𝗦𝘆𝘀𝘁𝗲𝗺 𝗗𝗲𝘀𝗶𝗴𝗻 𝗕𝗮𝘀𝗶𝗰𝘀: 𝗪𝗵𝗮𝘁 𝗶𝘀 𝗖𝗮𝗰𝗵𝗲 𝗜𝗻𝘃𝗮𝗹𝗶𝗱𝗮𝘁𝗶𝗼𝗻?
    
    Cache invalidation is the process of removing or updating…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/C5622AQHtckHsCFAHPg/feedshare-shrink_800/0/1677550765012?e=2147483647&amp;v=beta&amp;t=tZ7naSHGXlViCoyIkAdw_5ykKP7N91rjBIbVTctTalk" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              𝗦𝘆𝘀𝘁𝗲𝗺 𝗗𝗲𝘀𝗶𝗴𝗻 𝗕𝗮𝘀𝗶𝗰𝘀: 𝗪𝗵𝗮𝘁 𝗶𝘀 𝗖𝗮𝗰𝗵𝗲 𝗜𝗻𝘃𝗮𝗹𝗶𝗱𝗮𝘁𝗶𝗼𝗻?
    
    Cache invalidation is the process of removing or updating…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                    
        
        
        
        
        
        
        
        
        
    
        
        
        
          <div class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-main-card flex flex-wrap py-2 pr-2 babybear:pr-0
            
            base-main-card--link main-activity-card">
            
    
            <a class="base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]" href="https://www.linkedin.com/posts/alexxubyte_systemdesign-coding-interviewtips-activity-7037462920582066177-YDYq?trk=public_profile_like_view" data-tracking-control-name="public_profile_like_view" data-tracking-will-navigate>
              
              <span class="sr-only">
                  
              
              Backend burger :)
    .
    .
    Great diagram by Brij Kishore Pandey
    —
    Subscribe to our weekly newsletter to get a Free System Design PDF (158 pages):…
          
          
              </span>
            </a>
    
          
              <div class="base-main-card__media relative w-[228px] block h-[134px] overflow-hidden flex-shrink-0 rounded-[2px] babybear:w-full babybear:h-auto babybear:min-h-[134px] babybear:max-h-[250px]
                  ">
                
            <img class="main-activity-card__img h-full " data-delayed-url="https://media.licdn.com/dms/image/C4E22AQFvSrthuARZ6g/feedshare-shrink_800/0/1677861904357?e=2147483647&amp;v=beta&amp;t=PcjrO464_r6psSeFGPa8U2KPCjdbSnxYyg_E-d3_c7w" alt>
          
    <!---->          </div>
    
            <div class="base-main-card__info self-center ml-1 flex-1 relative break-words papabear:min-w-0 mamabear:min-w-0 babybear:w-full">
              <h3 class="base-main-card__title font-sans text-[18px] font-bold text-color-text overflow-hidden
                  ">
                
              Backend burger :)
    .
    .
    Great diagram by Brij Kishore Pandey
    —
    Subscribe to our weekly newsletter to get a Free System Design PDF (158 pages):…
          
              </h3>
              
    
                <h4 class="base-main-card__subtitle body-text text-color-text overflow-hidden">
                  
            Liked by <a href="https://lk.linkedin.com/in/kekayan?trk=public_profile_like_view_actor-name" data-tracking-control-name="public_profile_like_view_actor-name" data-tracking-will-navigate="true" class="hidden-nested-link">Kekayan Nanthakumar</a>
          
                </h4>
    
    <!---->
    <!---->        </div>
    
    <!---->      
        
          </div>
      
      
      
      
      
                </ul>
            
          </div>
        </section>
      
      
      
    
    <!---->
            
    
        
        
        
        
        
        
        
        
        
        
    
        
        <section class="core-section-container my-3 bottom-cta-banner">
    <!---->
    <!---->
    <!---->
          <div class="core-section-container__content break-words">
            
          
        
    
        <section class="hidden-summary container-lined p-3 overflow-hidden babybear:p-2" data-impression-id="public_profile_bottom-cta-banner_guest_hidden_summary">
                <h2 class="hidden-summary__title text-xl text-color-text overflow-hidden break-words mb-2 leading-regular font-normal">
                  View Kekayan’s full profile
                </h2>
    
          <ul class="hidden-summary__summary-items">
                  <li class="hidden-summary__summary-item flex text-md text-color-text font-normal leading-open items-center mb-1.5 last:mb-0">
                    <div class="hidden-summary__summary-item-icon-container flex items-center justify-center shrink-0 mr-1">
                      <icon class="hidden-summary__summary-item-icon h-2 w-2
                          " alt data-delayed-url="https://static.licdn.com/aero-v1/sc/h/au8rc359lanmyfaah39izyss1"></icon>
                    </div>
                    <span class="hidden-summary__summary-item-text overflow-hidden break-words">
                      See who you know in common
                    </span>
                  </li>
                  <li class="hidden-summary__summary-item flex text-md text-color-text font-normal leading-open items-center mb-1.5 last:mb-0">
                    <div class="hidden-summary__summary-item-icon-container flex items-center justify-center shrink-0 mr-1">
                      <icon class="hidden-summary__summary-item-icon h-2 w-2
                          " alt data-delayed-url="https://static.licdn.com/aero-v1/sc/h/bk9h057z1lch588recizysfdc"></icon>
                    </div>
                    <span class="hidden-summary__summary-item-text overflow-hidden break-words">
                      Get introduced
                    </span>
                  </li>
                  <li class="hidden-summary__summary-item flex text-md text-color-text font-normal leading-open items-center mb-1.5 last:mb-0">
                    <div class="hidden-summary__summary-item-icon-container flex items-center justify-center shrink-0 mr-1">
                      <icon class="hidden-summary__summary-item-icon h-2 w-2
                          " alt data-delayed-url="https://static.licdn.com/aero-v1/sc/h/engl6kavv3716laqjpfbilqqt"></icon>
                    </div>
                    <span class="hidden-summary__summary-item-text overflow-hidden break-words">
                      Contact Kekayan directly
                    </span>
                  </li>
          </ul>
    
              
                  <a class="hidden-summary__cta hidden-summary__cta--secondary btn-sm !text-[16px] btn-secondary-emphasis inline-block mt-3 mr-1.5" href="https://www.linkedin.com/signup/public-profile-join?vieweeVanityName=kekayan&amp;trk=public_profile_bottom-cta-banner" data-tracking-control-name="public_profile_bottom-cta-banner" data-tracking-will-navigate>
                      Join to view full profile
                  </a>
            
        </section>
      
        
          </div>
        </section>
      
      
        
          </section>
      
      
    
    <!---->  
              
          
            </div>
          </section>
          <section class="right-rail papabear:w-right-rail-width papabear:ml-column-gutter mamabear:max-w-[790px] mamabear:px-mobile-container-padding babybear:max-w-[790px] babybear:px-mobile-container-padding">
            
            
                
        
        
        
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
            
          <section class="aside-section-container mb-4">
    
    <!---->
    <!---->
            <div class="aside-section-container__content break-words">
              
              
        
        
        
    
        <div class="career-hub-cta container-lined flex flex-row p-2">
          <img class="career-hub-cta__img block mr-1.5 w-[39px] h-[39px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/6jd3nbl8hgvgcpth9addkyx3a" alt>
          <div class="career-hub-cta__content">
            <h2 class="career-hub-cta__title font-sans text-[18px] leading-regular font-bold text-color-text mb-0.5">
              Looking for career advice?
            </h2>
            <p class="career-hub-cta__body font-sans text-sm leading-regular text-color-text">
              Visit the Career Advice Hub to see tips on accelerating your career.
            </p>
            <a href="https://www.linkedin.com/pulse/topics/home/" class="career-hub-cta__btn btn-sm btn-primary inline-block mt-1" data-tracking-control-name="public_profile_career-hub-cta" data-tracking-will-navigate>
              View Career Advice Hub
            </a>
          </div>
        </div>
      
            
            </div>
          </section>
      
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
              
        
        
    
        
          
          <section class="aside-section-container mb-4 course-recommendations">
    
                
                <h2 class="aside-section-container__title section-title">
                  
            Add new skills with these courses
          
                </h2>
            
              
    <!---->
            <div class="aside-section-container__content break-words">
              
            <ul class="course-recommendations__courses">
                <li class="course-recommendations__course">
                  
        
    
        
        
        
          <a href="https://www.linkedin.com/learning/spring-cloud?trk=public_profile_recommended-course" target="_self" data-tracking-control-name="public_profile_recommended-course" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
            hover:show-play-button focus:show-play-button
            base-aside-card--link aside-learning-course-card">
            
    
    <!---->
          
                <div class="base-aside-card__media flex-shrink-0 h-[54px] mr-0.5 overflow-hidden relative w-[95px]">
                  
            <img class="base-aside-card__media-element w-[100px] h-full" alt data-delayed-url="https://media.licdn.com/dms/image/C560DAQEOfiPBIoA2uw/learning-public-crop_144_256/0/1666029491671?e=1682521200&amp;v=beta&amp;t=Q3XXWbUESYN9TXLqYmb_5ETSZ3hcWBflR4hjgb6i2mI">
    <!---->      
                    <icon class="base-aside-card__play-button w-auto play-button overlay-center" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9n9raq7fmdu241tpsxwodsmcd" data-svg-class-name="base-aside-card__play-button-svg"></icon>
                </div>
    
            <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
              <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
                
            Spring Cloud
          
    <!---->          </h3>
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->        </div>
          
        
          </a>
      
      
      
      
                </li>
                <li class="course-recommendations__course">
                  
        
    
        
        
        
          <a href="https://www.linkedin.com/learning/running-spring-boot-in-production?trk=public_profile_recommended-course" target="_self" data-tracking-control-name="public_profile_recommended-course" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
            hover:show-play-button focus:show-play-button
            base-aside-card--link aside-learning-course-card">
            
    
    <!---->
          
                <div class="base-aside-card__media flex-shrink-0 h-[54px] mr-0.5 overflow-hidden relative w-[95px]">
                  
            <img class="base-aside-card__media-element w-[100px] h-full" alt data-delayed-url="https://media.licdn.com/dms/image/C560DAQHy72nZ_tWmNw/learning-public-crop_144_256/0/1644341549909?e=1682521200&amp;v=beta&amp;t=Q9lD2zTw_MPYdz9MfPIAVQ0PLmM42yuZXbvJiAqcOMk">
    <!---->      
                    <icon class="base-aside-card__play-button w-auto play-button overlay-center" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9n9raq7fmdu241tpsxwodsmcd" data-svg-class-name="base-aside-card__play-button-svg"></icon>
                </div>
    
            <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
              <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
                
            Running Spring Boot in Production
          
    <!---->          </h3>
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->        </div>
          
        
          </a>
      
      
      
      
                </li>
                <li class="course-recommendations__course">
                  
        
    
        
        
        
          <a href="https://www.linkedin.com/learning/extending-securing-and-dockerizing-spring-boot-microservices?trk=public_profile_recommended-course" target="_self" data-tracking-control-name="public_profile_recommended-course" data-tracking-will-navigate class="base-card relative w-full hover:no-underline focus:no-underline base-card--link base-aside-card flex my-1.5
            hover:show-play-button focus:show-play-button
            base-aside-card--link aside-learning-course-card">
            
    
    <!---->
          
                <div class="base-aside-card__media flex-shrink-0 h-[54px] mr-0.5 overflow-hidden relative w-[95px]">
                  
            <img class="base-aside-card__media-element w-[100px] h-full" alt data-delayed-url="https://media.licdn.com/dms/image/C4E0DAQElkao0ppJGSg/learning-public-crop_144_256/0/1617317156467?e=1682521200&amp;v=beta&amp;t=XCMWWp4kFKP_PpxhsgZ37lHCmRtMT2vmH_jeabto7Vc">
    <!---->      
                    <icon class="base-aside-card__play-button w-auto play-button overlay-center" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/9n9raq7fmdu241tpsxwodsmcd" data-svg-class-name="base-aside-card__play-button-svg"></icon>
                </div>
    
            <div class="base-aside-card__info self-center pl-0.5 flex flex-col flex-1">
              <h3 class="base-aside-card__title font-sans text-md font-bold text-color-text relative">
                
            Extending, Securing, and Dockerizing Spring Boot Microservices
          
    <!---->          </h3>
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->        </div>
          
        
          </a>
      
      
      
      
                </li>
            </ul>
            <a href="https://lk.linkedin.com/learning/?trk=seo_pp_d_cymbii_more_m020_learning" class="course-recommendations__view-all-link" data-tracking-control-name="seo_pp_d_cymbii_more_m020_learning" data-tracking-will-navigate>
              See all courses
            </a>
          
            </div>
          </section>
      
      
      
    
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
    <!---->
              
    
        
        
        
    
        
          
          <section class="aside-section-container mb-4 profile-badge">
    
                
                <h2 class="aside-section-container__title section-title">
                  
            Kekayan’s public profile badge
          
                </h2>
            
              
    <!---->
            <div class="aside-section-container__content break-words">
              
            <p class="badge__subheading">Include this LinkedIn profile on other websites</p>
            
    
        
        
        
        
        
        
    
        <article class="profile-card profile-card--badge" itemscope itemtype="http://schema.org/Person">
          <header class="profile-card__header">
            
          <img class="artdeco-entity-image artdeco-entity-image--circle-3
               profile-card__profile-image" data-delayed-url="https://media.licdn.com/dms/image/C5603AQHMqhLLTJzP2A/profile-displayphoto-shrink_800_800/0/1641108903285?e=2147483647&amp;v=beta&amp;t=AZ56v8Cx53N0ZbRHe7e-KGiHgx35FOCWtLXY1PCm1vI" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry" alt="Kekayan Nanthakumar">
      
            <div class="profile-card__header-info">
                <h3 class="profile-card__header-name" itemprop="name">
                  Kekayan Nanthakumar
                </h3>
                <p class="profile-card__header-headline" itemprop="jobTitle">Senior Software Engineer at Insighture | 2x AWS | AWS SAA | AWS DVA | Serverless Enthusiast</p>
            </div>
          </header>
            <section class="profile-card__section ">
              <ul class="profile-card__list">
                  
          <li class="profile-list-item profile-list-item--company profile-badge-item" itemprop="affiliation" itemscope itemtype="http://schema.org/Organization">
            
    
        
        
        
    
        
          <img class="artdeco-entity-image artdeco-entity-image--square-1
               profile-list-item__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQEN2IzLOGFYFA/company-logo_100_100/0/1613486083132?e=2147483647&amp;v=beta&amp;t=QNybgwgo9qp4rfHThjWdvgw_Snc0sJI7OtZB2mdObgc" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/3dtfvv2esz58o2zimai1h3v2d" alt="company image for Insighture - We&amp;#39;re hiring">
      
        <p class="profile-list-item__name profile-list-item__name--company" itemprop="name">
            Senior Software Engineer at Insighture - We&#39;re hiring
        </p>
      
          </li>
      
              </ul>
            </section>
    <!---->        <section class="profile-card__section">
    <!---->          <ul class="profile-card__list">
                  
          <li class="profile-list-item profile-list-item--school profile-badge-item" itemprop="affiliation" itemscope itemtype="http://schema.org/Organization">
            
    
        
        
        
    
        
          <img class="artdeco-entity-image artdeco-entity-image--square-1
               profile-list-item__image" data-delayed-url="https://media.licdn.com/dms/image/C560BAQGTFCXTiB6wqA/company-logo_100_100/0/1519865292985?e=2147483647&amp;v=beta&amp;t=nhff6E7sS9pK76J7pgT8sVJlsheU4dys8d4S5kX0ZQ8" data-ghost-classes="artdeco-entity-image--ghost" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/csnc6op83cjt60ym5equoy1km" alt="school image for University of Kelaniya Sri Lanka">
      
        <p class="profile-list-item__name profile-list-item__name--school" itemprop="name">
            University of Kelaniya Sri Lanka
        </p>
      
          </li>
      
              </ul>
            </section>
    <!---->      <footer class="profile-card__footer profile-card__footer--badge">
              <button disabled class="profile-card__footer-button">View profile</button>
              <icon class="profile-card__linkedin-logo" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/a3fnfnqvbbolvy47fxmpit4t4"></icon>
          </footer>
        </article>
      
            <a class="badge__link" href="https://www.linkedin.com/badges/profile/create?vanityname=kekayan&amp;preferredlocale=en_US&amp;trk=public_profile_badge" data-tracking-control-name="public_profile_badge" data-tracking-will-navigate>
              View profile badges
            </a>
          
            </div>
          </section>
      
      
      
    
    
    <!---->  
              
          
          </section>
        </main>
    
    <!---->
        
    
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    
        
        
        
        
        
        
        
        
        
    
        
        
        
        
    
        <footer class="li-footer bg-transparent w-full ">
          <ul class="li-footer__list flex flex-wrap flex-row items-start justify-start w-full h-auto min-h-[50px] my-[0px] mx-auto py-3 px-2 papabear:w-[1128px] papabear:p-0">
            
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            
              <span class="sr-only">LinkedIn</span>
              <icon class="li-footer__copy-logo text-color-logo-brand-alt inline-block self-center h-[14px] w-[56px] mr-1" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/e12h2cd8ac580qen9qdd0qks8"></icon>
              <span class="li-footer__copy-text flex items-center">&copy; 2023</span>
            
      </li>
    
            
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://about.linkedin.com?trk=public_profile_v3_desktop_footer-about" data-tracking-control-name="public_profile_v3_desktop_footer-about" data-tracking-will-navigate>
              
              About
            
            </a>
      </li>
    
            
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/accessibility?trk=public_profile_v3_desktop_footer-accessibility" data-tracking-control-name="public_profile_v3_desktop_footer-accessibility" data-tracking-will-navigate>
              
              Accessibility
            
            </a>
      </li>
    
            
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/legal/user-agreement?trk=public_profile_v3_desktop_footer-user-agreement" data-tracking-control-name="public_profile_v3_desktop_footer-user-agreement" data-tracking-will-navigate>
              
              User Agreement
            
            </a>
      </li>
    
            
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/legal/privacy-policy?trk=public_profile_v3_desktop_footer-privacy-policy" data-tracking-control-name="public_profile_v3_desktop_footer-privacy-policy" data-tracking-will-navigate>
              
              Privacy Policy
            
            </a>
      </li>
    
    <!---->        
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/legal/cookie-policy?trk=public_profile_v3_desktop_footer-cookie-policy" data-tracking-control-name="public_profile_v3_desktop_footer-cookie-policy" data-tracking-will-navigate>
              
              Cookie Policy
            
            </a>
      </li>
    
            
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/legal/copyright-policy?trk=public_profile_v3_desktop_footer-copyright-policy" data-tracking-control-name="public_profile_v3_desktop_footer-copyright-policy" data-tracking-will-navigate>
              
              Copyright Policy
            
            </a>
      </li>
    
            
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://brand.linkedin.com/policies?trk=public_profile_v3_desktop_footer-brand-policy" data-tracking-control-name="public_profile_v3_desktop_footer-brand-policy" data-tracking-will-navigate>
              
              Brand Policy
            
            </a>
      </li>
    
              
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/psettings/guest-controls?trk=public_profile_v3_desktop_footer-guest-controls" data-tracking-control-name="public_profile_v3_desktop_footer-guest-controls" data-tracking-will-navigate>
              
                Guest Controls
              
            </a>
      </li>
    
            
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            <a class="li-footer__item-link flex items-center font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover focus:text-color-link-focus" href="https://www.linkedin.com/legal/professional-community-policies?trk=public_profile_v3_desktop_footer-community-guide" data-tracking-control-name="public_profile_v3_desktop_footer-community-guide" data-tracking-will-navigate>
              
              Community Guidelines
            
            </a>
      </li>
    
            
    <!---->
              
              
      <li class="li-footer__item font-sans text-xs text-color-text-low-emphasis flex flex-shrink-0 justify-start p-1 relative w-50% papabear:justify-center papabear:w-auto">
            
                  
    
        
        
    
        
    
        
    
        <div class="collapsible-dropdown collapsible-dropdown--footer collapsible-dropdown--up flex items-center relative hyphens-auto language-selector z-2">
    <!---->
            <ul class="collapsible-dropdown__list hidden container-raised absolute w-auto overflow-y-auto flex-col items-stretch z-1 bottom-[100%] top-auto" role="menu" tabindex="-1">
              
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="العربية (Arabic)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-ar_AE" data-locale="ar_AE" role="menuitem" lang="ar_AE">
                    العربية (Arabic)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Čeština (Czech)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-cs_CZ" data-locale="cs_CZ" role="menuitem" lang="cs_CZ">
                    Čeština (Czech)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Dansk (Danish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-da_DK" data-locale="da_DK" role="menuitem" lang="da_DK">
                    Dansk (Danish)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Deutsch (German)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-de_DE" data-locale="de_DE" role="menuitem" lang="de_DE">
                    Deutsch (German)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="English (English) selected" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link--selected" data-tracking-control-name="language-selector-en_US" data-locale="en_US" role="menuitem" lang="en_US">
                    <strong>English (English)</strong>
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Español (Spanish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-es_ES" data-locale="es_ES" role="menuitem" lang="es_ES">
                    Español (Spanish)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Français (French)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-fr_FR" data-locale="fr_FR" role="menuitem" lang="fr_FR">
                    Français (French)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="हिंदी (Hindi)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-hi_IN" data-locale="hi_IN" role="menuitem" lang="hi_IN">
                    हिंदी (Hindi)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Bahasa Indonesia (Indonesian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-in_ID" data-locale="in_ID" role="menuitem" lang="in_ID">
                    Bahasa Indonesia (Indonesian)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Italiano (Italian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-it_IT" data-locale="it_IT" role="menuitem" lang="it_IT">
                    Italiano (Italian)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="日本語 (Japanese)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-ja_JP" data-locale="ja_JP" role="menuitem" lang="ja_JP">
                    日本語 (Japanese)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="한국어 (Korean)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-ko_KR" data-locale="ko_KR" role="menuitem" lang="ko_KR">
                    한국어 (Korean)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Bahasa Malaysia (Malay)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-ms_MY" data-locale="ms_MY" role="menuitem" lang="ms_MY">
                    Bahasa Malaysia (Malay)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Nederlands (Dutch)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-nl_NL" data-locale="nl_NL" role="menuitem" lang="nl_NL">
                    Nederlands (Dutch)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Norsk (Norwegian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-no_NO" data-locale="no_NO" role="menuitem" lang="no_NO">
                    Norsk (Norwegian)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Polski (Polish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-pl_PL" data-locale="pl_PL" role="menuitem" lang="pl_PL">
                    Polski (Polish)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Português (Portuguese)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-pt_BR" data-locale="pt_BR" role="menuitem" lang="pt_BR">
                    Português (Portuguese)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Română (Romanian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-ro_RO" data-locale="ro_RO" role="menuitem" lang="ro_RO">
                    Română (Romanian)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Русский (Russian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-ru_RU" data-locale="ru_RU" role="menuitem" lang="ru_RU">
                    Русский (Russian)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Svenska (Swedish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-sv_SE" data-locale="sv_SE" role="menuitem" lang="sv_SE">
                    Svenska (Swedish)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="ภาษาไทย (Thai)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-th_TH" data-locale="th_TH" role="menuitem" lang="th_TH">
                    ภาษาไทย (Thai)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Tagalog (Tagalog)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-tl_PH" data-locale="tl_PH" role="menuitem" lang="tl_PH">
                    Tagalog (Tagalog)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Türkçe (Turkish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-tr_TR" data-locale="tr_TR" role="menuitem" lang="tr_TR">
                    Türkçe (Turkish)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="Українська (Ukrainian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-uk_UA" data-locale="uk_UA" role="menuitem" lang="uk_UA">
                    Українська (Ukrainian)
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="简体中文 (Chinese (Simplified))" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-zh_CN" data-locale="zh_CN" role="menuitem" lang="zh_CN">
                    简体中文 (Chinese (Simplified))
                </button>
              </li>
              <li class="language-selector__item" role="presentation">
                <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
                <button aria-label="正體中文 (Chinese (Traditional))" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                    language-selector__link !font-regular" data-tracking-control-name="language-selector-zh_TW" data-locale="zh_TW" role="menuitem" lang="zh_TW">
                    正體中文 (Chinese (Traditional))
                </button>
              </li>
    <!---->      
            </ul>
    
              
            <button class="language-selector__button select-none relative pr-2 font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover hover:cursor-pointer focus:text-color-link-focus focus:outline-dotted focus:outline-1" aria-expanded="false" data-tracking-control-name="footer-lang-dropdown_trigger">
              <span class="language-selector__label-text mr-0.5 break-words">
                Language
              </span>
              <icon class="language-selector__label-chevron w-2 h-2 absolute top-0 right-0" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/cyolgscd0imw2ldqppkrb84vo"></icon>
            </button>
          
        </div>
      
      
              
      </li>
    
          </ul>
    
    <!---->    </footer>
      
      
      
    
              
        <form class="google-one-tap" action="https://www.linkedin.com/uas/login-submit" method="post">
          <input name="loginCsrfParam" value="cc965f76-c69c-4efc-8596-b5381e65686e" type="hidden">
    
            <input name="session_redirect" value="https://lk.linkedin.com/in/kekayan" type="hidden">
    
          <input name="trk" value="public_profile_google-one-tap-submit" type="hidden">
          <div id="google-one-tap__container" class="google-one-tap__container" data-tracking-control-name="public_profile_google-one-tap"></div>
    
          
        <div class="loader loader--full-screen">
          <div class="loader__container mb-2 overflow-hidden">
            <icon class="loader__icon inline-block loader__icon--default text-color-progress-loading" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/ddi43qwelxeqjxdd45pe3fvs1" data-svg-class-name="loader__icon-svg--large fill-currentColor h-[60px] min-h-[60px] w-[60px] min-w-[60px]"></icon>
          </div>
        </div>
      
        </form>
      
    
              
    
        
        
        
        
        
        
    
        
    
        
    
          <div class="cta-modal overflow-hidden container-raised z-10 fixed bottom-3 right-3 min-h-[56px] p-2 babybear:hidden conversion-modal" data-impression-id="public_profile_conversion-modal_cta-modal" role="dialog" aria-labelledby="cta-modal-header" aria-describedby="cta-modal-subheader">
              <h2 id="cta-modal-header" class="cta-modal__header text-xl leading-regular font-bold text-color-text mr-[28px]">You’re signed out</h2>
    
              <h3 id="cta-modal-subheader" class="cta-modal__subheader text-md leading-open font-normal text-color-text mt-0.5">Sign in for the full experience.</h3>
    
            
          <a class="cta-modal__primary-btn btn-md btn-primary inline-block w-full mt-3" href="https://www.linkedin.com/login?session_redirect=https%3A%2F%2Flk%2Elinkedin%2Ecom%2Fin%2Fkekayan&amp;fromSignIn=true&amp;trk=public_profile_conversion-modal-signin" data-tracking-control-name="public_profile_conversion-modal-signin" data-tracking-will-navigate>
            Sign in
          </a>
    
            <div class="cta-modal__google-sign-in-container mt-1.5">
                
        
    
        <form class="google-sign-in-cta-widget" action="https://www.linkedin.com/uas/login-submit" method="post" novalidate>
          <input name="loginCsrfParam" value="cc965f76-c69c-4efc-8596-b5381e65686e" type="hidden">
    
            <input name="session_redirect" value="https://lk.linkedin.com/in/kekayan" type="hidden">
    
          <input name="trk" value="public_profile_google-sign-in-submit" type="hidden">
          <button class="google-sign-in-cta-widget__btn btn-md btn-secondary hover:cursor-pointer flex items-center justify-center w-full h-auto" data-tracking-control-name="public_profile_google-sign-in-btn" data-tracking-litms type="button">
            <icon class="google-sign-in-cta-widget__icon onload w-[18px] min-h-[18px] leading-[18px] block" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/36lpn9v7fqsm6i7t6ny8bgacs"></icon>
            <span class="google-sign-in-cta-widget__text ml-2">Sign in with Google</span>
          </button>
    
          
        <div class="loader loader--full-screen">
          <div class="loader__container mb-2 overflow-hidden">
            <icon class="loader__icon inline-block loader__icon--default text-color-progress-loading" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/ddi43qwelxeqjxdd45pe3fvs1" data-svg-class-name="loader__icon-svg--large fill-currentColor h-[60px] min-h-[60px] w-[60px] min-w-[60px]"></icon>
          </div>
        </div>
      
        </form>
      
              <div class="cta-modal__google-divider flex -mb-1.5">
                <hr class="cta-modal__divider artdeco-divider my-3 w-full">
                <p class="cta-modal__or text-md font-bold leading-open text-color-text mx-1 self-center">or</p>
                <hr class="cta-modal__divider artdeco-divider my-3 w-full">
              </div>
            </div>
            <a class="cta-modal__secondary-btn btn-md inline-block w-full mt-1.5
                cta-modal__secondary-btn--with-google btn-secondary text-color-text-secondary px-4 align-middle" href="https://www.linkedin.com/signup/public-profile-join?vieweeVanityName=kekayan&amp;trk=public_profile_conversion-modal-join&amp;session_redirect=https%3A%2F%2Flk.linkedin.com%2Fin%2Fkekayan" data-tracking-control-name="public_profile_conversion-modal-join" data-tracking-will-navigate>
              Join now
            </a>
    
    <!---->    
    
            <button class="cta-modal__dismiss-btn absolute top-2 right-2 hover:cursor-pointer focus:outline focus:outline-2 focus:outline-color-action" data-tracking-control-name="public_profile_conversion-modal_dismiss" aria-label="Dismiss">
              <icon class="cta-modal__dismiss-icon block h-3 w-3 onload" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/gs508lg3t2o81tq7pmcgn6m2"></icon>
            </button>
          </div>
      
      
    
    <!---->
    <!---->
    <!---->
    <!---->
              <code id="enableFingerprintingJS" style="display: none"><!--true--></code>
              <code id="fingerprintingUrlPath" style="display: none"><!--"/platform-telemetry/li/collect"--></code>
              <code id="fingerprintingWaitTime" style="display: none"><!--2000--></code>
              <code id="fid" style="display: none"><!--"AQFFQNU-OfbqLwAAAYeZ89Q9xaqhRZtoOBpvefEFEloCYDZ-Ut_2-dEELmoB6FRSYxBkrpu1JHwdyw"--></code>
    
            <code id="enablePlatformJs" style="display: none"><!--true--></code>
    
              
        <img class="bc " style="display:none;" width="1" height="1" data-delayed-url="https://ponf.linkedin.com/pixel/tracking.png?reqid=tid-AAX5sWBwuKBpLkGiq+F0Lg==&amp;pageInstance=urn:li:page:public_profile_v3;/ROiwfrsRpy21qLoz2CHnA==&amp;js=enabled">
          <noscript>
            <img class="bc " style="display:none;" width="1" height="1" src="https://ponf.linkedin.com/pixel/tracking.png?reqid=tid-AAX5sWBwuKBpLkGiq+F0Lg==&amp;pageInstance=urn:li:page:public_profile_v3;/ROiwfrsRpy21qLoz2CHnA==&amp;js=disabled">
          </noscript>
      
    
            
        <script src="https://static.licdn.com/aero-v1/sc/h/9sn1zok4p6eezwn6ksfw0it7u" async></script>
      
          
    
                <script src="https://static.licdn.com/aero-v1/sc/h/cy523xojuc8yvy6fyiy9hd1el" async></script>
              
              <script data-delayed-url="https://static.licdn.com/aero-v1/sc/h/etkd25e7kzp2lrg1w9y0kixlu" data-module-id="google-sign-in-lib"></script>
              <script data-delayed-url="https://static.licdn.com/aero-v1/sc/h/98lptr8kagfxge22q7k1fps8" data-module-id="google-one-tap-lib"></script>
              
        <script id="insightsTag" type="text/javascript">
          _linkedin_partner_id = "3252572"; window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        </script><script type="text/javascript">
          (function(l) { if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])}; window.lintrk.q=[]} var s =
          document.getElementsByTagName("script")[0]; var b = document.createElement("script"); b.type =
          "text/javascript";b.async = true; b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
          s.parentNode.insertBefore(b, s);})(window.lintrk);
        </script>
        <noscript>
          <img height="1" width="1" style="display:none;" alt src="https://px.ads.linkedin.com/collect/?pid=3252572&amp;fmt=gif">
        </noscript>
      
          
          </body>
        </html>
      
      `
    const $ = cheerio.load(markup);
    const linkedinActivities = $(".activities > div > ul > li");
    const linkedinActivityItems = [];
    linkedinActivities.each((i, el) => {
      const activityTitle = $(el).find('.base-card > .base-main-card__info > .base-main-card__title').text().trim()
      linkedinActivityItems.push(activityTitle);
    });
    const starterQuestions = await getConversationStartersBasedOnLinkedInActivity(linkedinActivityItems);
    preInterviewBrief['starters'] = starterQuestions;

    const companySummary = await getCompanySummary(dto.companyLinkedInUrl);
    preInterviewBrief['companySummary'] = companySummary;
    
    const about = $(".summary > div > p");
    const aboutSummery = await getSummary(about.text());
    preInterviewBrief['interviewer']['about'] = aboutSummery;

    const education = $(".education__list > li");
    const educationItems = [];
    education.each((i, el) => {
      const educationInstitute = $(el).find('.profile-section-card__contents > .profile-section-card__title').text().trim()
      const educationTitle = $(el).find('.profile-section-card__contents > .profile-section-card__subtitle').text().trim()
      const educationTimePeriod = $(el).find('.profile-section-card__contents > .profile-section-card__meta > .education__item--duration > .date-range').text().trim()
      const educationItem = `${educationInstitute}, ${educationTitle}, (${educationTimePeriod})`;
      educationItems.push(educationItem);
    });
    preInterviewBrief['interviewer']['education'] = educationItems;

    const workItems = [];
    const workExperience = $(".experience > div > .experience__list > li");
    workExperience.each((i, el) => {
      
      const workTitle = $(el).find('.profile-section-card__contents > .profile-section-card__title').text().trim()
      const workCompany = $(el).find('.profile-section-card__contents > .profile-section-card__subtitle').text().trim()
      const workDuration = $(el).find('.profile-section-card__contents > .profile-section-card__meta > .experience-item__duration').text().trim()
      const workLocation = $(el).find('.profile-section-card__contents > .profile-section-card__meta > .experience-item__location').text().trim()
      const workDescription = $(el).find('.profile-section-card__contents > .profile-section-card__meta > .experience-item__description').text().trim()
      const workItem = `${workCompany}: ${workTitle}, (${workDuration})`;
      workItems.push(workItem);
    });
    preInterviewBrief['interviewer']['workExperience'] = workItems;
    preInterviewBrief['aboutJob'] = await getJobPostingInformation(dto.jobPostUrl);
    
    return preInterviewBrief;
  }

}
