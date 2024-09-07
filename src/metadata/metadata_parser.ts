import fs from 'fs';
import path from 'path';

interface JsonMetadata {
  [key: string]: {
    title: string;
    description: string;
    image: string
  };
}

export function parseMetadataFile(filePath: string): JsonMetadata {
  const absolutePath = path.resolve(filePath);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const parsedContent: JsonMetadata = JSON.parse(fileContent);
  return parsedContent;
}
