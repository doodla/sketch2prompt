# AI-Assisted Mind Map Expander

An innovative feature that allows users to create hierarchical mind maps with AI assistance for exploring and planning projects visually.

## Overview

The Mind Map Expander transforms sketch2prompt into a collaborative thinking tool where AI helps you flesh out your ideas, maintain consistent abstraction levels, and explore concepts in structured ways.

## Key Features

### 1. **Hierarchical Mind Map Nodes**
- Create free-form mind map nodes to capture project ideas and vision
- Organize nodes in a parent-child hierarchy
- Track abstraction levels to maintain consistent depth
- Visual indentation shows node relationships

### 2. **AI-Powered Expansion**
- Click "AI Expand" on any node to let AI suggest child nodes
- AI maintains the same level of abstraction as sibling nodes
- Receives suggestions for:
  - Child nodes with labels and descriptions
  - Edits to improve current node descriptions
  - Context-aware expansions based on parent/sibling nodes

### 3. **Interactive Suggestion System**
- Review AI suggestions in a dedicated panel
- **Accept**: Apply suggestions to add child nodes or update descriptions
- **Edit**: Modify suggestions before applying
- **Reject**: Dismiss suggestions you don't want
- **Comment**: Add notes about suggestions (future feature)

### 4. **Drill-Down Navigation**
- Explore button to focus on a node's children
- Navigate through complex hierarchies
- Return to parent level as needed

### 5. **Visual Design**
- Indigo/purple gradient theme for mind map nodes
- Status indicators for:
  - Child count
  - Pending suggestions (amber badges)
  - Comments (blue badges)
- Level badges showing abstraction depth
- Error display for API issues

## How to Use

### Creating Mind Map Nodes

1. **Via Command Palette (Ctrl+K)**:
   - Press `Ctrl+K` to open command palette
   - Type "Mind Map" or press `7`
   - Node appears at canvas center

2. **Via Quick Add (+)**:
   - Press `+` key
   - Select "Mind Map" from menu
   - Node appears at canvas center

3. **Via Double-Click**:
   - Double-click canvas
   - Cycles through node types including Mind Map

### Expanding Nodes with AI

1. **Select a node** you want to expand
2. **Click "AI Expand"** button
3. **Wait** for AI to generate suggestions (shows spinner)
4. **Review** suggestions in the panel that appears
5. **Take action**:
   - **Accept**: Adds child nodes to canvas
   - **Edit**: Modify before accepting
   - **Reject**: Remove suggestion

### Understanding Abstraction Levels

The AI maintains consistent abstraction levels:

- **Level 0** (Root): High-level themes, major phases, core pillars
  - Example: "User Experience", "Technical Infrastructure"

- **Level 1**: Key capabilities or major features within a theme
  - Example: Under "User Experience" → "Onboarding Flow", "Core Interactions"

- **Level 2**: Specific features or components
  - Example: Under "Onboarding Flow" → "Welcome Screen", "Account Creation"

- **Level 3+**: Very specific implementation details or sub-tasks
  - Example: Under "Welcome Screen" → "Logo Animation", "Sign In Button"

### Best Practices

1. **Start Broad**: Begin with high-level concepts at Level 0
2. **One Level at a Time**: Expand one level deeper, don't skip levels
3. **Use Descriptions**: Add context to nodes for better AI suggestions
4. **Iterate**: Accept, refine, and re-expand as your vision evolves
5. **Connect Nodes**: Draw edges between related concepts

## Technical Architecture

### Data Model
```typescript
// Node metadata includes mind map fields
type NodeMeta = {
  // Existing fields
  description?: string
  techStack?: string[]

  // Mind map fields
  parentId?: string          // Link to parent node
  childIds?: string[]        // Links to child nodes
  isExpanded?: boolean       // Expansion state
  suggestions?: AISuggestion[] // Pending AI suggestions
  comments?: string[]        // User comments
  level?: number             // Abstraction level
}
```

### AI Expansion Flow
```
User clicks "AI Expand"
  ↓
useMindMapExpander hook
  ↓
MindMapExpander service
  ↓
Build context (parent, siblings, level)
  ↓
Call AI API (Anthropic/OpenAI)
  ↓
Parse response into suggestions
  ↓
Store in node metadata
  ↓
Open SuggestionPanel
  ↓
User accepts/rejects
  ↓
Update nodes and edges
```

### Component Structure
- **MindMapNode**: Renders individual mind map nodes
- **SuggestionPanel**: Right sidebar for reviewing AI suggestions
- **useMindMapExpander**: Hook managing expansion logic
- **MindMapExpander**: Service class for AI API calls

## Configuration

### API Requirements
- Requires an API key (Anthropic or OpenAI)
- Configure in settings before using AI expansion
- Works with both providers

### Prompt Engineering
The AI receives:
- Node label and description
- Parent node label (if exists)
- Sibling node labels
- Current abstraction level
- Level-specific guidance
- User instructions (optional)

## Future Enhancements

- [ ] Auto-layout for hierarchical trees
- [ ] Collapsible subtrees
- [ ] Export mind maps as structured documents
- [ ] Templates for common mind map patterns
- [ ] Collaborative editing
- [ ] Mind map-specific export format
- [ ] Voice input for rapid capture
- [ ] AI-suggested connections between branches

## Use Cases

### 1. Project Planning
Break down a project into phases, features, and tasks with AI assistance

### 2. Knowledge Exploration
Start with a concept and let AI help you explore related sub-topics

### 3. Decision Trees
Map out decisions and their consequences hierarchically

### 4. System Design
Architect systems from high-level components to implementation details

### 5. Learning Paths
Create curriculum outlines from courses to lessons to concepts

## Keyboard Shortcuts

- `7`: Quick add Mind Map node
- `Ctrl+K` → "Mind Map": Add via command palette
- Click node suggestions: Open suggestion panel
- `Escape`: Close suggestion panel

## Troubleshooting

### "API key not configured"
- Add an API key in settings
- Supports Anthropic and OpenAI

### Suggestions not appearing
- Check API key is valid
- Ensure internet connection
- Check browser console for errors

### Child nodes not positioning correctly
- Manual adjustment may be needed
- Auto-layout feature coming soon

## Contributing

To extend the mind map feature:

1. **Add new suggestion types** in `src/core/types.ts`
2. **Modify AI prompts** in `src/core/mindmap-expander.ts`
3. **Enhance UI** in `src/components/nodes/MindMapNode.tsx`
4. **Improve parsing** in `MindMapExpander.parseExpansionResponse()`

## License

Same as sketch2prompt main project.
