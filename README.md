# BreachCraft: The AI-Powered Offensive Security Toolkit

**An advanced, portfolio-grade tool for generating, analyzing, and hardening reverse shell payloads, designed to showcase real-world security engineering skills.**

## Overview

BreachCraft is not just another script generator. It is an intelligent offensive security tool designed to mirror the workflow and thought process of a professional security engineer. By leveraging a powerful Large Language Model (LLM) through Google's Genkit, BreachCraft performs expert-level tasks without relying on any hardcoded lists, templates, or simulations. Every piece of analysis and every generated script is the result of the AI applying its extensive, real-world knowledge of cybersecurity.

This project was built to demonstrate a deep understanding of both offensive tradecraft and modern AI implementation, making it a powerful centerpiece for a security engineering portfolio.

---

## Core Features

-   **Intelligent Payload Generation**: Crafts functional reverse shell payloads tailored to specific target environments. You define the OS, architecture, available tools, and language, and BreachCraft builds the optimal script.
-   **Listener Generation**: Instantly provides the correct listener command (e.g., `netcat`) required to catch the incoming connection from your generated payload.
-   **Delivery Vector Suggestions**: Recommends common and effective one-liner commands to download and execute your payload on a target, based on the specified operating system.
-   **In-Depth Payload Analysis (The "DNA" Feature)**: Provides a comprehensive security report on any generated payload. This isn't just an explanation; it's a structured analysis that includes:
    -   A technical breakdown of the script's components.
    -   Actionable Host and Network-based Indicators of Compromise (IOCs).
    -   A professional risk analysis.
    -   A calculated Risk Score visualized in a chart.
-   **AI-Powered Evasion**: Utilizes advanced AI to rewrite a payload, making it harder for Antivirus (AV) and Endpoint Detection & Response (EDR) solutions to detect. The AI explains the exact evasion techniques it applied.
-   **Environment Templating**: Quickly load common environment configurations (e.g., "Linux Bash TCP," "Windows PowerShell") to streamline payload creation while retaining full manual control.

---

## The BreachCraft Methodology: How the AI Works (100% Realistic)

The core principle behind BreachCraft is that **the AI *is* the expert**. The application does not contain hardcoded logic for generating scripts or analyzing them. Instead, each feature is powered by a carefully engineered prompt that assigns the AI a specific **Persona** and a detailed **Task**.

This "Persona-Task" framework forces the AI to draw upon its vast training data—which includes countless security articles, academic papers, malware analyses, and public code repositories—to function as a specialist.

### 1. Payload Generation, Listeners, and Delivery

-   **Persona**: "Expert in generating reverse shell scripts and corresponding listener commands."
-   **Task**: The AI is given a detailed environment profile (OS, available tools, IP, etc.) and instructed to build a functional payload and the corresponding listener command. It pieces together commands based on system constraints, just as a human engineer would. For delivery vectors, it acts as a penetration tester, suggesting common, real-world methods to deploy a payload.
-   **Result**: A functional, context-aware script, not one picked from a static list.

### 2. Payload Analysis (The "DNA" Feature)

-   **Persona**: "Senior Security Analyst."
-   **Task**: The AI's mission is to analyze a script and produce a structured security report. It uses its deep knowledge of system internals, network protocols, and malware behavior to break down the script's function, identify forensic evidence (IOCs), and assess its risk. **Crucially, the numerical Risk Score is not simulated; it is a direct output of the AI's own qualitative analysis**, based on factors like payload complexity, stealth, and potential impact.
-   **Result**: An analysis grounded in established security principles, providing the kind of actionable intelligence a defender would need.

### 3. AI-Powered Evasion

-   **Persona**: "Expert penetration tester specializing in malware development and evasion techniques."
-   **Task**: The AI performs a code review of the script. It uses its training to identify patterns, functions, and strings (e.g., `Invoke-Expression`, `/bin/bash -i`) likely to be flagged by real AV and EDR systems. It then applies sophisticated techniques like string obfuscation, encoding, and alternative syntax to create a functionally identical but stealthier script.
-   **Result**: An obfuscated payload and a clear explanation of the applied techniques, demonstrating an understanding of modern defense evasion.

This method ensures the app's functionality is genuine. The AI is the tool, performing expert-level tasks based on its extensive, real-world knowledge of cyber defense and attack mechanisms.

---

## Tech Stack

-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **AI Integration**: Google Genkit
-   **UI**: React, Tailwind CSS, ShadCN UI
-   **Styling**: Framer Motion for animations

---

## Portfolio Descriptions

### For LinkedIn

I'm excited to share my latest portfolio project, **BreachCraft**: an AI-powered offensive security toolkit built with Next.js and Google Genkit.

BreachCraft is designed to mirror the workflow of a professional security engineer. It uses a powerful AI to generate, analyze, and harden reverse shell payloads, but with a key difference: there are **no simulations**. Every piece of analysis and every generated script is the result of the AI applying its extensive, real-world knowledge of cybersecurity.

Key Features:
-   **Intelligent Payload & Evasion**: Crafts a payload for any environment, then uses AI to rewrite it, making it harder for AV/EDR solutions to detect.
-   **Payload DNA**: Provides a deep security report on any script, complete with actionable IOCs, a technical breakdown, and an AI-calculated risk score visualized in a chart.

This project was a deep dive into advanced prompt engineering and building a tool that is both functionally powerful and 100% realistic in its methodology.

### For a Resume

-   Developed **BreachCraft**, an AI-powered offensive security toolkit using Next.js, TypeScript, and Google Genkit to generate payloads across **7 common scripting languages** and perform expert-level security analysis.
-   Engineered a "Payload DNA" feature to produce a **5-point security report** with actionable IOCs and an AI-calculated risk score visualized in a chart, alongside an AI-driven Evasion module that applies dynamic obfuscation.
-   Designed and implemented a professional UI using React, Tailwind CSS, and ShadCN, leveraging advanced prompt engineering to guide the AI in performing expert-level, practical security analysis.
