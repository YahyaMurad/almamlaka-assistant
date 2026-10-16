# almamlaka-assistant

# Stack
| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js | Uusage is simple, provides modularization, I am very familiar with it |
| Backend | FastAPI | Async-first, lightweight, python fitting the ML ecosystem, gives the developer the flexibility and not restrictive like Django |
| Database | pgvector | Fewer moving parts than two separate DBs |
| LLM | `gpt-6-luna` | No reason, I have API credits with OpenAI |
| Embeddings | `text-embedding-3-small` | Does the job, if I had other requirements like multimodality I could go with another model |

# Features
- Multi-turn conversations
- Presistent chat storage per browser
- Password-protected Admin Dashboard
- In-app PDF citation viewer
- AlMamlaka Branding (Downloaded from the official website)

# Chunking Strategy

The documents provided already give a nice starting point because they are structured and formatted appropriately, therefore, one of the optimal strategies that can be followed here is a structure-based chunking strategy, where the headers and sections of the PDF are identified, chunked, and stored with the appropriate metadata. Now obviously, this is not an extremely reliable strategy to follow in a production environment, as we could receive documents that are not structured, therefore the RAG system fallsback to chunking using regular character count and overlapping.

There might be more suitable chunking strategies for this use case like contextual chunking, however, for the specific count and shape of documents provided, I decided it was better to go with a simple approach, than a more complicated overkill approach. Obviously under different circumstances, another strategy could be used.

# Vector DB

Pgvector is one of the easier vector databases that can one can deal with, setting it up is extremely simple and using it integrates extremely well with whatever ORM you are using, making it ideal to use with all frameworks and languages, other choices could include things like Chroma or Qdrant, but their usage is often extremely specific, where you have specific constraints or DB specific requirements, other than that pgvector acts extremely well as a vector DB for simple RAG applications, it also can double as a regular DB, which in my case was needed to enable multi-turn conversations

# Prompting

Utilizing a fairly recent model like GPT 6, very rigorous prompting is not required, especially OpenAI models, I personally find that their models are extremely adept at following prompt instructions and not deviating from defined personas or roles. Therefore, simple prompting was enough to give the model the context it needed to act as an assistant for this specific project, and not answer anything outside its knowledge base

The prompting also handles conflicting results from the RAG, if the model ever receives two different bits of information it is instructed to handle that conflict and show both bits of information 

# Deployment

The project is currently deployed on Railway, a platform that provides extremely easy and unsophisticated deployment experience

# Extra Features
## Monitoring
One of the very much overlooked parts of RAG systems and generally any chatbot, or even generic ML models, is monitoring, knowing how your user's the app, when they use it, how much they use it, this is for one critical when it comes to cost management, but it is also critical when it comes to enhancing user experience, taking a look at user chats and where they flag issues could allow for great insight on what to add and change

## Document Upload
A RAG system is incomplete without the ability to update the LLM's knowledge base, because the knowledge the LLM has can easily become outdated and get changed, therefore, every RAG system should have easy access to modify, whether it be adding or deleting, the ingested documents in the vector DB, this could easily be done through the developer's working on the app, but since most likely the system will be monitored by a non-technical person, adding simple upload and delete buttons to a dashboard goes a long way