from docx import Document

text_content = """1. Explain different types of cyber security testing (AC 1.1)
Answer:
ok so theres like a few different types. first theres vulnerability scanning which is basically just software that goes and looks for problems automatically. we used something called nessus in class and it literally just scans everything and spits out a list. its not that clever tbh it just matches things against a database of known problems.

then theres penetration testing which is way more interesting. thats where an actual person tries to hack in. not random its like a hired person. i watched a video on youtube about this guy who does pen testing for banks and he found a way in through the wifi in the car park which is actually mad. the scanner wouldve never found that.

social engineering is different cause its not about the computers its about tricking people. phishing emails and stuff. my mum clicked a fake paypal email last year and nearly gave her card details out so yeah that works lol

and theres red teaming which is like the full package, they do everything at once over weeks. dont think smaller companies do this cause it costs loads.

2. Identify why cyber security testing is important (AC 1.2)
Answer:
basically if you dont test you dont know whats broken. simple as that really.

companies store loads of sensitive stuff like payment details and personal info and if they get hacked thats really bad for them legally and reputation wise. also some industries have to do testing by law like if you handle card payments you have to do it. i think its called PCI DSS.

also attackers are always finding new ways in so even if you tested last year something new might have come up since then. you cant just do it once and forget about it.

3. Compare types of cyber security testing (AC 1.3)
Answer:
vulnerability scanning vs pen testing is the main one. scanning is quick and cheap and covers loads of ground but it only finds known stuff. pen testing is slower and costs more but finds things scanners would miss completely.

social engineering is completely different to both cause its not technical at all. you could have the most secure network in the world and someone just calls up pretending to be IT support and asks for a password and thats it your in.

i think the main thing is they all find different things so you probably need more than one. like scanning for the obvious stuff then pen testing for the deeper problems.

4. Consider mitigations following cyber security testing (AC 1.4)
Answer:
so when you find a vulnerability you have to fix it. the technical fixes are normally straightforward like update software, change settings, close ports that dont need to be open.

the harder bit is when you cant actually fix it properly. like if someones running really old software that cant be updated cause the whole system depends on it. then you have to do other things around it like put it on a separate part of the network so if it does get compromised it cant spread everywhere. thats called network segmentation i think.

also prioritising matters. you cant fix everything at once so you do the critical stuff first. anything that could let someone straight in from the internet is top priority.

5. Explain why it is important to retest following any changes made (AC 1.5)
Answer:
cause sometimes the fix doesnt actually work?? like you think youve patched something but maybe you did it wrong or only patched one system out of three. if you dont retest you just assume its fine when it might not be.

also fixing one thing can sometimes break something else or create a new problem. so retesting checks that the original issue is gone AND that you havent made anything worse.

6. Explain how the outcomes of cyber security testing can be reported (AC 1.6)
Answer:
different people need different information tbh.

for technical people you give them the full details, which systems, what the vulnerability is, how serious it is, how to fix it. stuff like CVE numbers and technical steps.

for management and directors you cant give them all that cause they wont understand it and dont have time. so you give them like a summary. here are the risks, here is how bad it could be, here is what it costs to fix. basically make it about money and reputation cause thats what they care about.

there are proper report formats for this, like executive summary at the top then technical details after for whoever needs them.

7. Explain why the outcomes of cyber security testing must be reported (AC 1.7)
Answer:
if you find problems and dont tell anyone they just stay as problems. reporting forces someone to actually do something about it.

also for legal reasons. if you get breached and you knew about a vulnerability but didnt document it or report it thats much worse for the company legally. at least if you reported it and management decided not to fix it thats on them not you.

8. Identify cyber security vulnerabilities (AC 2.1)
Answer:
theres loads but they basically fall into a few categories.

technical ones are things like unpatched software, weak passwords, ports that shouldnt be open, misconfigured systems. this is the main stuff scanners look for.

human vulnerabilities are when people are the weak point. clicking phishing links, using the same password everywhere, writing passwords on sticky notes (my old geography teacher literally had his on a post-it on his monitor which is wild), letting people tailgate through doors.

physical vulnerabilities are like unlocked server rooms, people being able to plug in usb drives, laptops being left unattended.

cloud stuff is a big one now too cause people set up storage buckets or whatever and accidentally leave them public and then anyones data is just out there.

9. Demonstrate the steps to be taken when a vulnerability has been identified (AC 2.2)
Answer:
first dont panic and dont just immediately shut everything down cause that can cause more problems.

verify its actually real cause scanners throw up false positives all the time. then figure out how serious it is. theres a scoring system called CVSS, anything over 9 is critical, 7 to 9 is high, and so on. critical stuff you drop everything for, low stuff goes in the queue.

then you contain it so it cant spread or be exploited while youre fixing it. then actually fix it. then test that the fix worked. then document everything cause youll need records of what happened and what you did.

tell the right people throughout, dont just quietly fix things without anyone knowing.

10. Apply the correct response to the vulnerability (AC 2.3)
Answer:
log4shell is the example we did in class. december 2021, basically a massive vulnerability in this java logging library called log4j that loads of software uses. the exploit was called log4shell. attackers could run whatever code they wanted on vulnerable servers just by sending a specially crafted string.

the immediate response was to block the attack pattern at the firewall/WAF level while patches were being developed. the actual patch took a few days to come out from most vendors. then it was a race to patch everything before attackers got there.

the lesson is that even libraries that arent the main software can be massive vulnerabilities. log4j was just a background logging tool and it was in basically everything.

11. Develop an appropriate communication to mitigate future vulnerabilities (AC 2.4)
Answer:
security awareness training is the main thing. people need to actually know what to look for. like what phishing emails look like, why they shouldnt use the same password everywhere, not to plug in random usb drives they find.

regular reminders help too. not just a one hour training session once a year cause people forget. like short updates when theres a new threat or a reminder not to click dodgy links.

and make it easy to report things. if someone thinks theyve clicked something suspicious they need to feel like they can tell IT without getting in trouble. if people are scared to report mistakes those mistakes just get hidden until theyre a bigger problem.

12. Identify cyber security controls (AC 3.1)
Answer:
controls are basically the things you put in place to reduce risk. they come in three types:

Technical - firewalls, antivirus, MFA, encryption, access controls
Administrative - policies, procedures, training, acceptable use agreements
Physical - locks, keycard access, CCTV, secure areas for servers

you need all three. point having great technical controls if someone can just walk into the server room.

13. Explain a basic cyber security framework (AC 3.2)
Answer:
a framework is basically a structured way of approaching security so youre not just making it up as you go.

cyber essentials is the uk government one. five main areas: firewalls, secure configuration, user access control, malware protection, patch management. its quite basic but its a starting point and you can get certified which looks good.

NIST CSF is the american one and its more detailed. five functions: identify, protect, detect, respond, recover. the recover bit is important cause most frameworks focus on stopping attacks but NIST makes you think about what you do when something actually gets through.

14. Evaluate a cyber security framework (AC 3.3)
Answer:
cyber essentials is good for small businesses cause its not too complicated and its affordable to get certified. covers the basics that would stop most automated attacks. but its not enough for bigger organisations or ones with more sensitive data.

NIST is more thorough but its a lot of work to implement properly. loads of documentation required. probably not realistic for a small team. but for bigger companies its worth it cause it makes you think about the whole security lifecycle not just prevention.

the main criticism of any framework is that you can tick all the boxes and still get breached cause the threat landscape changes constantly and frameworks get updated slower than attackers find new methods.

15. Explain how to apply controls (AC 4.1)
Answer:
you figure out what needs protecting, how bad it would be if it was compromised, and then apply controls based on that. dont waste money protecting stuff that doesnt matter and dont leave important stuff exposed.

its called risk based approach basically.

16. Implement a basic cyber security control (AC 4.2)
Answer:
MFA is the one most people know. instead of just a password you also need a second thing, usually a code from your phone. so even if someone steals your password they still cant get in without your phone.

rolling it out you start with a small group first to find problems before you force everyone to use it. then you tell people its coming (they still wont read the email), then you turn it on. first week or two is always chaos cause people dont have the app set up or their phone dies. but after that it just becomes normal.

we had to do this for college and half the class rang IT on the first day cause they couldnt log in. completely predictable.

17. Justify the implementation of the chosen cyber security control (AC 4.3)
Answer:
passwords on their own arent secure anymore full stop. people reuse them, they get leaked in data breaches, people choose obvious ones. there are literally websites where you can check if your email address has been in a breach and loads of peoples passwords are just out there.

MFA basically makes stolen passwords useless on their own. microsoft published stats saying MFA blocks something like 99.9% of account compromise attacks. thats massive. the inconvenience of getting a code on your phone is completely worth it compared to having your account taken over.

the only real argument against it is people find it annoying. which yeah it is a bit. but thats not a good enough reason not to do it.

18. Explain why a control might not be applied (AC 4.4)
Answer:
cost is the obvious one. proper security tools arent cheap and smaller organisations have to prioritise. sometimes the cost of implementing a control is higher than the estimated cost of the risk it prevents so they just accept the risk.

sometimes the control causes too much disruption. like if adding extra authentication to a system means workers are slower and that costs the business money, management might decide the security risk is acceptable compared to the operational impact.

and sometimes its just politics. someone senior doesnt want the inconvenience so they get an exception. which kind of defeats the whole point but thats how it goes sometimes."""

doc = Document()
for paragraph_text in text_content.split('\n'):
    if paragraph_text.strip():
        doc.add_paragraph(paragraph_text)

doc.save(r"docs/cyber_security_assessment_final.docx")
print("Teen voice rewrite complete.")
