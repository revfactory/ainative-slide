# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean language presentation slideshow about AI Native transformation and data asset strategies. The presentation consists of 12 HTML pages (page1.html through page12.html) that tell the story of Kakao's journey towards becoming an AI Native organization through data assetization.

## Architecture

- **Static HTML Presentation**: Each page is a standalone HTML file using Tailwind CSS for styling
- **Consistent Design System**: All pages share common styling with Kakao's yellow branding (#FEE500)
- **Font Assets**: Uses Noto Sans KR for Korean typography and FontAwesome for icons
- **CSS Framework**: Tailwind CSS 2.2.19 loaded via CDN
- **Responsive Design**: Fixed container width of 1280px optimized for presentation displays

## Styling Standards

- **Primary Color**: Kakao Yellow (#FEE500) with variants (.kakao-yellow, .kakao-yellow-bg)
- **Typography**: Noto Sans KR font family with weights 300-900
- **Container**: Fixed 1280px width with 720px minimum height (.slide-container)
- **Animations**: Floating animations and hover effects for interactive elements
- **Layout**: Gradient backgrounds and consistent spacing using Tailwind utilities

## Content Structure

The presentation covers:
1. Title slide (AI Native transformation concept)
2. Agenda overview
3. Internal data activation strategies
4. External data integration approaches  
5. AI-based knowledge platform development
6. Performance measurement and challenges
7. Kakao's journey and future vision

Each page follows a consistent template with header, main content area, and bottom decoration elements.