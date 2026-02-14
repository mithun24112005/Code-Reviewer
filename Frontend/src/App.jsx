import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {
    const [code, setCode] = useState(`function example() {
  // Write your code here
  return "Hello World";
}`)
    const [review, setReview] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Get API URL from environment variable
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    useEffect(() => {
        prism.highlightAll()
    }, [])

    async function reviewCode() {
        try {
            setLoading(true)
            setError(null)
            const response = await axios.post(`${API_URL}/ai/get-response`, {
                prompt: code
            })
            // Extract the result text from response
            setReview(response.data.result || '')
        } catch (err) {
            setError(err.message)
            setReview('Error getting review. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    function clearAll() {
        setCode('')
        setReview('')
        setError(null)
    }

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <div className="brand">
                    <span className="logo-icon">{'<CR>'}</span>
                    <h1>Code Reviewer</h1>
                </div>
                <div className="actions">
                    {/* Theme toggle could go here */}
                </div>
            </header>

            {/* Main Content Split Pane */}
            <main className="main-content">

                {/* Left Pane: Code Editor */}
                <section className="pane editor-pane">
                    <div className="pane-header">
                        <h3>Input Code</h3>
                        <div className="pane-actions">
                            <button className="btn-secondary" onClick={clearAll}>Clear</button>
                        </div>
                    </div>
                    <div className="editor-container glass-panel">
                        <div className="line-numbers">
                            {code.split('\n').map((_, i) => (
                                <span key={i}>{i + 1}</span>
                            ))}
                        </div>
                        <div className="code-wrapper">
                            <Editor
                                value={code}
                                onValueChange={code => setCode(code)}
                                highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
                                padding={10}
                                style={{
                                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                                    fontSize: 14,
                                    backgroundColor: 'transparent',
                                    minHeight: '100%',
                                }}
                                textareaClassName="code-textarea"
                            />
                        </div>
                    </div>
                    <div className="action-bar">
                        <button
                            className="btn-primary analyze-btn"
                            onClick={reviewCode}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="scanning">Analyzing...</span>
                            ) : (
                                <>Analyze Code ✨</>
                            )}
                        </button>
                    </div>
                </section>

                {/* Right Pane: AI Feedback */}
                <section className="pane review-pane">
                    <div className="pane-header">
                        <h3>Review Results</h3>
                    </div>
                    <div className="review-container glass-panel">
                        {error && <div className="error-banner">{error}</div>}

                        {loading ? (
                            <div className="loader-state">
                                <div className="spinner"></div>
                                <p>Gemini is reviewing your code...</p>
                            </div>
                        ) : review ? (
                            <div className="markdown-content">
                                <Markdown rehypePlugins={[rehypeHighlight]}>
                                    {review}
                                </Markdown>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">👋</div>
                                <p>Submit your code to receive AI-powered feedback.</p>
                            </div>
                        )}
                    </div>
                </section>

            </main>
        </div>
    )
}

export default App
