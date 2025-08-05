# 🗂️ Trove - AI-powered knowledge curation system

Trove is an intelligent knowledge management system that combines a browser extension with a Model Context Protocol (MCP) server to create a seamless RAG (Retrieval-Augmented Generation) workflow. Save web content with one keystroke, let AI automatically tag and organize it, then access it through Claude or any MCP-compatible AI assistant.

## 🌟 Overview

Trove consists of three main components:

    🌐 Browser Extension - Captures full web page content with one keystroke
    🤖 MCP Server - Processes content with AI and provides RAG-ready access
    💬 Claude Integration - Search and retrieve your curated knowledge in conversations

## ✨ Key Features

### 🚀 One-Click Content Capture

    Keyboard Shortcut: Cmd+Shift+S (Mac) or Ctrl+Shift+S (Windows/Linux)
    Smart Content Extraction: Automatically identifies and extracts main content, removing ads and navigation
    Rich Metadata: Captures headings, links, code blocks, and structured data
    Cross-Browser: Works in Firefox and Chrome

### 🤖 AI-Powered Organization

    Automatic Tagging: AI analyzes content and generates relevant tags
    Smart Categorization: Groups content by topics, technologies
    Content Chunking: Breaks content into RAG-optimized chunks with embeddings

### 🔍 Powerful Retrieval

    Semantic Search: Find content by meaning, not just keywords
    MCP Integration: Access your knowledge directly in Claude conversations
    Multiple Export Formats: JSON, JSONL, and Markdown for different use cases
    Context-Aware Results: Returns relevant chunks with source attribution

### 🏗️ Architecture

<img width="499" height="294" alt="image" src="https://github.com/user-attachments/assets/4d28571a-5bc1-4f93-b1e5-861717db46a7" />


## 🛠️ Installation

### 📋 Prerequisites

    OpenAI API key (for AI analysis and embeddings)
    Firefox or Chrome browser
    Claude account (for MCP integration)

### 🌐 Browser Extension Setup

For Firefox:

    Download Extension Files

    trove-link-saver-firefox/
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    ├── background.js
    ├── content.js
    └── icons/ (16px, 32px, 48px, 128px PNG files)

    Install Extension
        Open Firefox → about:debugging
        Click "This Firefox"
        Click "Load Temporary Add-on"
        Select manifest.json from your folder

    Set Keyboard Shortcut
        Go to about:addons
        Click gear icon → "Manage Extension Shortcuts"
        Set shortcut for "Save current page to Trove"

For Chrome:

![Note] Chrome version with Manifest V3 coming soon.

### 🤖 MCP Server Connection

Your Trove MCP server is already deployed at: [https://f753516b850a142422840bc1.fp.dev/mcp](https://f753516b850a142422840bc1.fp.dev/mcp)
Connect to Claude:

    In Claude, add a new MCP server
    URL: https://f753516b850a142422840bc1.fp.dev/mcp
    Name: Trove MCP

## 🚀 How to Use

### 📚 Saving Content

    Navigate to any webpage you want to save
    Press Cmd+Shift+S (or your configured shortcut)
    Extension popup opens showing:
        URL preview
        Content analysis (word count, reading time)
        AI-generated tag suggestions
    Add optional manual tags if desired
    Click "Save Link"

What happens behind the scenes:

    ✅ Full page content extracted (text, headings, links, code)
    ✅ AI analyzes content and generates relevant tags
    ✅ Content chunked into RAG-optimized segments
    ✅ Vector embeddings created for semantic search
    ✅ Everything stored in your knowledge base

### 🔍 Searching Your Knowledge

In Claude Conversations:

"Search my Trove for information about React hooks"

"Find links I've saved about API design"

"Show me content related to machine learning tutorials"

### Available MCP Tools

    search_links - Search through your saved links
    get_collection - Retrieve specific collections
    export_context - Generate context for prompts
    add_link - Save new links via MCP

### 📊 Example Workflow

    Save a Tutorial
        Visit: https://react.dev/learn/state-a-components-memory
        Press Cmd+Shift+S
        AI automatically tags: react, javascript, tutorial, state-management, frontend

    Save Documentation
        Visit: https://docs.openai.com/api/embeddings
        Press Cmd+Shift+S
        AI automatically tags: openai, api, embeddings, documentation, ai

    Search in Claude
        Ask: "Find my saved content about React state management"
        Claude uses MCP to search your Trove
        Returns relevant chunks with source links

## 🎯 Use Cases

👨‍💻 For Developers

    Save documentation and tutorials with automatic tech stack tagging
    Curate code examples with language and framework detection
    Build reference collections for specific projects or technologies
    Quick access to saved Stack Overflow solutions and GitHub repos

📚 For Researchers

    Organize academic papers with automatic topic classification
    Save research articles with intelligent summarization
    Build literature collections by research area
    Context-aware retrieval for writing and analysis

🎓 For Students

    Save course materials with automatic subject tagging
    Organize study resources by topic and difficulty
    Quick reference during assignments and projects
    Build knowledge base for exam preparation

✍️ For Content Creators

    Curate inspiration with automatic theme detection
    Save examples and references by content type
    Build resource collections for different projects
    Research assistance with semantic search

🔒 Privacy & Security

    Your data stays yours - stored in your Cloudflare account
    No tracking - extension only communicates with your server
    Encrypted storage - all data encrypted at rest
    API key security - OpenAI key stored as encrypted secret

🛠️ Technical Details
Technology Stack

    Runtime: Cloudflare Workers
    API Framework: Hono.js
    Database: Cloudflare D1 (SQLite)
    ORM: Drizzle ORM
    AI Provider: OpenAI (GPT-4o-mini + text-embedding-3-small)
    Vector Storage: SQLite with blob embeddings
    MCP Protocol: JSON-RPC over HTTP

Content Processing Pipeline

    Extraction → Clean HTML, extract text, headings, links
    Analysis → AI generates tags, categories, summary
    Chunking → Split into 500-word semantic chunks
    Embedding → Generate vector embeddings for each chunk
    Storage → Store in D1 with full-text and vector search
    Retrieval → Semantic search with relevance scoring

Cost Optimization

    ~$0.012 per link for full AI analysis
    Efficient chunking reduces embedding costs
    Smart caching prevents duplicate processing
    Batch operations for bulk imports

## 🚨 Troubleshooting

Extension Issues

    "Loading..." stuck: Check browser console for errors
    Content not saving: Verify server URL in background.js
    Keyboard shortcut not working: Check browser extension shortcuts settings

MCP Connection Issues

    Claude can't connect: Verify MCP server URL is correct
    No search results: Check if links were saved successfully
    Empty content: Ensure OpenAI API key is configured

Server Issues

    API errors: Check Cloudflare Workers logs
    Missing content: Verify content extraction in browser extension
    Slow responses: Check OpenAI API rate limits

## 📈 Roadmap

    Integration APIs for other knowledge tools
    Enhanced content types (PDFs, videos, podcasts)
    Collaborative collections with sharing
    Advanced search filters (date, domain, content type)
    Browser sync across devices
    Bulk import from bookmarks and read-later services
    Custom AI models for specialized domains

## 🤝 Contributing

This is a hackathon-style project built for personal knowledge management. Feel free to fork and adapt for your own use cases!
