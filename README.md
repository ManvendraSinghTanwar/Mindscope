# MindScope - Reflect Better. Feel Better. Live Better.

## Inspiration  
Mental health is a crucial aspect of well-being, but many people still struggle to find resources that are accessible, private, and genuinely supportive. **MindScope** was born out of the need for a safe, digital space where users can reflect, track their moods, and receive empathetic, AI-powered support anytime, anywhere.

## What It Does  
MindScope is a mental health companion app designed to provide users with a supportive and reflective environment. Users can write and analyze journal entries using AI-powered mood and emotion detection. They can also chat with an AI mental health companion for real-time support and guidance. The app enables tracking of daily mood, stress, energy, and sleep. It also allows users to record voice check-ins, which are analyzed for emotional tone.  
Additional features include privacy and notification management, access to crisis resources, and reminders for professional help.
Try it out:[MINDSCOPE - Reflect Better. Feel Better. Live Better. ](https://mindscope-five.vercel.app/)

## How We Built It  
The frontend is built using **React** and **Next.js**, offering a responsive design with modern UI components. We integrated AI capabilities using the **Llama 3.3-70B-Instruct-Turbo** model via the **Together API** for journal analysis and conversations. A **rule-based system** complements the AI by handling specific triggers, keyword recognition, and fallback logic to ensure consistent and safe responses.  User data such as journal entries, chat history, moods, and settings is stored locally in **JSON format** to protect user privacy.  The app features a dynamic chat UI with smooth auto-scrolling, easy entry deletion, and robust error handling.
We hosted the application on **Vercel** to ensure seamless and scalable deployment.

## Challenges We Ran Into  
One major challenge was ensuring the AI analysis consistently used the Llama model while gracefully handling API errors. Designing a chat interface that is both modern and accessible featuring auto-scrolling and adaptive sizing was also a technical hurdle.Balancing user privacy with useful analytics required thoughtful engineering. Additionally, we removed quick reply suggestions to make the chat feel more natural and human-like.

## Accomplishments That We're Proud Of  
We are proud of the seamless integration of advanced AI for journaling and chat support. The interface is user-friendly, visually appealing, and accessible to all. We implemented robust local data storage and privacy controls, allowing users to manage and delete entries easily.  
Most importantly, MindScope provides a supportive, stigma-free space where users can express themselves and seek help.

## What We Learned  
We learned the value of empathetic, clear communication in mental health-focused tools.  
Integrating large language models into real-world applications taught us how to balance performance with user experience.  We also discovered best practices for building **privacy-first**, user-centered web applications and honed our skills in UI/UX design for dynamic chat and journaling tools.

## What's Next for MindScope  
We plan to enhance our voice analysis features and introduce more interactive tools to help users reflect and grow. 
Visual insights like mood and journal trend charts will help users better understand their emotional patterns.  
Optional **cloud sync** will allow secure cross-device access, and we’ll ensure strong privacy controls are in place.  
We also aim to support multiple languages, improve accessibility, and collaborate with mental health professionals to offer more robust support and guidance.
