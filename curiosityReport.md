# Curiosity Report: (D)DOS Attacks
#### How do they work and what can we do about them?

## Introduction

During the in-class demonstration of the load testing deliverable earlier this semester, I was struck with the idea: What if I sent way more data than Professor Jensen is expecting? 

Initially, I thought it would just be funny to see him react to the large influx of data and have him brush it off as a joke. However, when I sent large amounts of data to his website while he was load testing, it wasn't as clear to him what was happening as I thought it would be. Though he may not have recognized that much more data was being sent, it did become quickly apparent that something had gone wrong. The metrics had stopped being sent to Grafana altogether, indicating that the site was crashing. 

He stepped us through the process of determining what was going on, and I kept waiting for the moment he would discover that someone was flooding the site with data. However, the conclusion he ultimately came to was that the site had crashed because all the database connections had been used up by the instances being spun up. Even then, it was not obvious what I had been doing. I figured I would reveal myself and what I had been doing. When I did, things became a lot more clear, and we had a good laugh about the situation.

However, something stuck with me that made me curious. I had heard about and knew what a Denial of Service attack was, but I had not ever considered how easy they are to perform, how confusing they are to experience, and how effective they can be in shutting down a service.

I was somewhat concerned knowing that all I needed was his web address and a script to bring the site to a screeching halt. After all, if I could do this with the little experience and hardware I had, what was to stop malicious actors from doing the same thing to any site they please?

Clearly this issue had been addressed before, but I was curious how it is taken care of on a regular basis. So, I have selected this as my topic for my curiosity report!

## What are Denial of Service (DOS) attacks and how do they work?

A DoS attack is a type of cyberattack aimed at making a service unavailable to its intended users. 

While this is commonly done through flood attacks (like the one described in the introduction), they can also take other forms, such as requests and programs designed to consume system resources, or specific methods like the Ping of Death (sending malformed or oversized packets to a service) or the Slowloris attack (sending partial requests to keep system resources tied up for as long as possible).

Ultimatley, no matter the method, a DOS attack aims to make the system unavailable to legitimate users.

### What about Distributed Denial of Service (DDOS) attacks?

What makes DDOS attacks different from a DOS attack is the fact that it is originating from a variety of computers, often forming a botnet of infected computers. Distributing the attack in this way makes it much harder to trace and to block.

## So, how do we deal with them?

When dealing with a denial of service attack, it often depends on whether it is distributed or not. If it is not, then blacklisting the source IP address can be effective, as well as implementing rate limiting to slow down how often requests can be made from a single device.

If the attack is distributed, these other methods become ineffective for stopping it, but other preventative measures can be taken to reduce or nullify attmepted attacks. For example, Cloudflare provides a service intercepts potentially malicious traffic (detected by watching for malicious patterns in activity) before allowing it to hit the site itself. 

Generally, implementing scalability and load balancing through services such as AWS can help reduce the impact of attacks, but ultimately does not solve the problem.

## Conclusion

In the end, I really enjoyed learning about DDOS attacks, how they work, and how they can be mitigated against. It was fun to be able to dive into a topic that caught my attention and share what I learned. Now when I prepare to implement a website or other service, I know the steps I can take to prepare for and prevent DDOS attacks.
