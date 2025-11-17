import { Injectable } from '@nestjs/common';
import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';
import * as pgvector from 'pgvector';

const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

@Injectable()
export class EmbeddingService {
  private extractor: FeatureExtractionPipeline;

  constructor() {
    void this.initializeExtractor();
  }

  async initializeExtractor() {
    this.extractor = await pipeline('feature-extraction', MODEL_ID);
  }

  async createEmbedding(text: string) {
    if (!this.extractor) {
      throw new Error('Embedding model not loaded');
    }

    const output = await this.extractor(text, {
      pooling: 'mean',
      normalize: true,
    });

    return pgvector.toSql(Array.from(output.data)) as string;
  }
}
