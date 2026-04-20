const { pipeline } = require("@huggingface/transformers");

let extractorPromise = null;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      "Xenova/bge-m3"
    );
  }
  return extractorPromise;
}

async function generateEmbedding(text) {
  const extractor = await getExtractor();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true
  });

  // Transformers.js output can be converted to normal array
  return Array.from(output.data);
}

function cosineSimilarity(a, b) {
  if (!a || !b || !a.length || !b.length || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (!magA || !magB) return 0;

  return dot / (magA * magB);
}

module.exports = {
  generateEmbedding,
  cosineSimilarity
};