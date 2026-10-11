---
title: Functional and Non Functional Requirements
excerpt: What the system should do versus how well it should do it — functional, non-functional and extended requirements with banking and food-delivery examples.
section: fundamentals
publishDate: 'Sep 29 2026'
---

Requirements analysis is a crucial phase in software development where the needs and expectations of users and stakeholders are identified and documented. It ensures the system is built correctly and meets its intended goals.

- **Functional Requirements:** Define what the system should do (features and operations).
- **Non-Functional Requirements:** Define how the system should perform (quality, performance, and constraints).

Example: In an online shopping system, functional requirements include features like user login and order placement, while non-functional requirements include system performance, security, and scalability.

## Functional Requirements

Functional requirements define the specific features and operations a system must perform to meet business and user needs. They describe what the system should do and how it interacts with users or other systems.

- Focus on the behavior and functionality of the system.
- Represent features that can be directly observed and tested in the final product.
- Examples include user authentication, data processing, search functionality, payment processing, and report generation.

### Sample Questions

- What features should the system include?
- What edge cases or special scenarios should the system handle?

## Non-Functional Requirements

Non-functional requirements (NFRs) define how well a system should operate, focusing on qualities such as performance, reliability, security, and usability rather than specific features. NFRs should be defined using measurable criteria or metrics so that they can be tested and evaluated.

- **Performance:** Response time, throughput, or latency targets
- **Security:** Protection against unauthorized access and security threats
- **Usability:** Ease of use and user experience
- **Reliability:** System stability, availability, and failure recovery
- **Scalability:** Ability to handle increasing users, traffic, or data
- **Maintainability:** Ease of updating, modifying, and fixing the system
- **Portability:** Ability to run across different environments or platforms

### Sample Questions

- How fast should the system respond to user actions?
- How secure should it be against unauthorized access?
- How available and reliable should the system be?

## Extended Requirements

In addition to functional and non-functional requirements, some systems may have additional requirements related to operations, security, experimentation, and future growth. The following are grouped as extended requirements for this article:

- **Logging:** Recording system activities and errors for debugging and analysis.
- **Monitoring & Alerting:** Tracking system health, performance, and failures.
- **Analytics:** Collecting usage data to understand user behavior and system performance.
- **Backup & Disaster Recovery:** Ensuring data can be restored after failures or disasters.
- **Rate Limiting:** Controlling the number of requests to prevent system overload or abuse.
- **Feature Flags / A-B Testing:** Enabling controlled feature releases and experiments.

### Sample Questions

- How will the system be monitored and alerted if failures occur?
- How will logs and analytics be collected for debugging and insights?
- How will the system recover from failures or data loss?

## Examples of Functional and Non-functional Requirements

A couple of examples to illustrate both types of requirements:

### 1. Online Banking System

**Functional Requirements:**

- Users should be able to log in with their username and password.
- Users should be able to check their account balance.
- Users should receive notifications after making a transaction.

**Non-functional Requirements:**

- The system should respond to user actions in less than 2 seconds.
- All transactions must be encrypted and comply with industry security standards.
- The system should be able to handle 100 million users with minimal downtime.

**Extended Requirements:**

- The system should log all transactions for auditing and fraud detection.
- The system should have automatic backups and disaster recovery mechanisms.
- The system should include monitoring and alerts to detect unusual activities.

### 2. Food Delivery App

**Functional Requirements:**

- Users can browse the menu and place an order.
- Users can make payments and track their orders in real time.

**Non-functional Requirements:**

- The app should load the restaurant menu in under 1 second.
- The system should support up to 50,000 concurrent orders during peak hours.
- The app should be easy to use for first-time users, with an intuitive interface.

**Extended Requirements:**

- The system should collect analytics on popular dishes and order trends.
- The system should include monitoring and logging to track errors and performance.
- The system should support A/B testing for new features like promotions or UI changes.

## Differences between Functional Requirements and Non-Functional Requirements

| Functional Requirements | Non-Functional Requirements |
| --- | --- |
| Define what the system should do (features & functionality) | Define how the system should perform (quality attributes) |
| Focus on system behavior and operations | Focus on performance, usability, security, reliability |
| Describe specific actions like login, data processing, transactions | Describe constraints like response time, scalability, availability |
| Directly visible to users and business needs | Indirectly visible, improve overall user experience |
| Easier to measure (output-based validation) | Harder to measure, uses metrics like SLAs, benchmarks |
| Drive the core functionality of the system | Influence architecture and system design decisions |
| Documented using use cases, user stories | Documented using technical specs, performance criteria |
| Examples: login authentication, data input/output, transaction processing. | Examples: scalability, security, response time, reliability, maintainability. |

## Common Challenges in Defining these Requirements

Defining system requirements can be challenging because they must balance functionality, performance, and long-term system goals. Poorly defined requirements can lead to design issues, delays, or systems that fail to meet user expectations.

- **Ambiguity in Requirements:** Vague or incomplete requirements make it difficult to clearly define what the system should do and how it should perform.
- **Changing Requirements:** Business goals, market conditions, or user expectations may change over time, requiring updates to the system design.
- **Difficulty in Prioritization:** Functional requirements often receive more attention, while important aspects like scalability, security, or monitoring may be overlooked.
- **Measuring Non-Functional Requirements:** Features are easier to test, but qualities like usability, scalability, and reliability are harder to measure and validate.
- **Overlapping or Conflicting Requirements:** Some requirements may conflict with others, such as strong security measures potentially affecting system performance.

## Gathering Functional, Non-functional and Extended Requirements

Gathering requirements involves multiple approaches and collaboration between the development team, stakeholders, and end-users.

### 1. Functional Requirements

- **Interviews:** Talk to stakeholders or users to understand their needs.
- **Surveys:** Distribute questionnaires to gather input from a larger audience.
- **Workshops:** Host sessions to brainstorm features and gather feedback.

### 2. Non-functional Requirements

- **Performance Benchmarks:** Consult with IT teams to set expectations for performance and load.
- **Security Standards:** Consult with security experts to define the best practices for data protection.
- **Usability Testing:** Test the system to find areas where users might struggle and refine the interface.

### 3. Extended Requirements

Extended requirements are gathered to improve system monitoring, reliability, and future enhancements beyond the core functionality.

- **Monitoring & Logging:** Consult DevOps teams to determine how system logs, metrics, and alerts will be collected and analyzed.
- **Analytics & Reporting:** Work with product teams to decide what user behavior or system data should be tracked for insights.
- **Backup & Disaster Recovery:** Discuss with infrastructure teams to define backup strategies and recovery procedures.
- **Rate Limiting & System Protection:** Identify limits on API requests and traffic control to prevent abuse or overload.
- **Feature Flags & Experiments:** Coordinate with product teams to plan controlled feature releases and A/B testing.
