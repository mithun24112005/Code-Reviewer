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
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
  // this is boilerplate add your code here
}`)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.post('http://localhost:3000/ai/get-response', { 
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

  return (
    <div className="app-container">
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                backgroundColor: '#0c0c0c',
                borderRadius: '0.7rem',
                height: '100%',
                width: '100%'
              }}
            />
          </div>
          <button
            onClick={reviewCode}
            disabled={loading}
            className="review">
            {loading ? 'Reviewing...' : 'Review Code'}
          </button>
        </div>
        <div className="right">
          {error && <div className="error">{error}</div>}
          {review && (
            <div className="markdown-content">
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review}
              </Markdown>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App