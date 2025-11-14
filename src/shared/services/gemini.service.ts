import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import * as z from 'zod';

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY')!,
    });
  }

  async generateContent<T>(
    prompt: string,
    responseSchema: z.ZodType,
    model: string = 'gemini-2.0-flash',
    temperature: number = 0.2,
  ) {
    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          candidateCount: 1,
          temperature,
          responseMimeType: 'application/json',
          responseSchema: z.toJSONSchema(responseSchema),
        },
      });

      return responseSchema.parse(JSON.parse(response.text!)) as T;
    } catch (error) {
      console.error(error);
      throw new Error('Gemini API error. Please try again later.');
    }
  }
}
