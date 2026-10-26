export interface CaseStudy {
  slug: string;
  title: string;
  context: string;
  problem: string;
  whatIDid: string[];
  tech: string[];
  result: string;
  tag: "AI" | "Data" | "Automation" | "Research";
}

/**
 * Every fact below comes directly from Rudra's resume.
 * No client names, revenue figures or outcomes are invented.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "voxcontextengine",
    title: "VoxContextEngine — Hybrid RAG Platform",
    tag: "AI",
    context: "Independent research & engineering project.",
    problem:
      "LLM answers are only as trustworthy as what they're grounded in — an ungrounded model will confidently make things up.",
    whatIDid: [
      "Built a document-grounded Retrieval-Augmented Generation engine with FastAPI and Docker to keep responses context-locked",
      "Combined dense vector search (Qdrant, all-MiniLM-L6-v2 embeddings, HNSW indexing) with sparse keyword search (Rank-BM25) in a hybrid architecture",
      "Built an automated Python evaluation suite to benchmark ingestion accuracy and hallucination resistance",
    ],
    tech: ["FastAPI", "Docker", "Qdrant", "BM25", "Python"],
    result: "Achieved a 100% safety run completeness score in hallucination validation testing.",
  },
  {
    slug: "datapurge-studio",
    title: "DataPurge Studio — Multi-tenant Data Engine",
    tag: "Data",
    context: "Built during a Data Engineering internship at BytePX.",
    problem:
      "Teams were manually processing complex, multi-sheet workbooks — slow, error-prone, and blocking downstream work.",
    whatIDid: [
      "Architected an asynchronous multi-tenant SaaS data engine with FastAPI and PostgreSQL",
      "Streamed data through io.BytesIO buffers on Starlette thread pools with dynamic type downcasting",
      "Designed an O(N) linear lookahead sniffer paired with rapidfuzz for fast fuzzy matching",
    ],
    tech: ["FastAPI", "PostgreSQL", "Python", "rapidfuzz"],
    result: "Processes complex multi-sheet workbooks in under 2 minutes with 99.9% accuracy — a 15–20x speedup over the manual process.",
  },
  {
    slug: "birbal-chatbot",
    title: "Birbal 2.0 — Multilingual Enterprise RAG Chatbot",
    tag: "AI",
    context: "Built during an AI & ML internship at UltraTech Cement Ltd. (Birla White).",
    problem:
      "Employees needed answers from dense, domain-specific technical documentation without waiting on slow, blockable retrieval queries.",
    whatIDid: [
      "Built an LLM-powered RAG pipeline with FastAPI to automate querying across technical documentation",
      "Replaced blockable SQL/API retrieval with asynchronous, NLP-driven pipelines and text classification",
      "Added bilingual Hindi–English support with contextual state tracking",
    ],
    tech: ["FastAPI", "RAG", "NLP", "LLMs"],
    result: "Cut employee query response latency by 95% and lifted regional team query workflow efficiency by 60%.",
  },
  {
    slug: "pneumonia-detection",
    title: "Pneumonia Detection & Genomic Analysis",
    tag: "Research",
    context: "Co-authored institutional healthcare research paper.",
    problem:
      "Non-invasive, automated diagnostic support for pneumonia and polygenic disorder risk needed a validated model architecture, not a proof-of-concept demo.",
    whatIDid: [
      "Co-authored a research paper on a hybrid deep learning architecture for non-invasive clinical diagnostics",
      "Trained convolutional neural networks on chest X-ray image datasets",
      "Applied logistic regression modelling to genomic sequence structures for multi-factor risk prediction",
    ],
    tech: ["CNNs", "Python", "Logistic Regression"],
    result: "Achieved 94% accuracy in automated pneumonia identification from chest X-rays.",
  },
];
