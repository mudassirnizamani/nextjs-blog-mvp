import fs from 'fs';
import path from 'path';

export interface JsonMetadata {
  [key: string]: {
    title: string;
    description: string;
    image: string
  };
}

export function parseMetadataFile(): JsonMetadata {
  const filePath = path.join(process.cwd(), 'public', 'metadata.json');
  const absolutePath = path.resolve(filePath);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const parsedContent: JsonMetadata = JSON.parse(fileContent);
  return parsedContent;
}


export function updateJsonFile(newData: JsonMetadata): void {
  console.log(newData)
  const filePath = path.join(process.cwd(), 'public', 'metadata.json');
  const absolutePath = path.resolve(filePath);

  // Read the existing file
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  let currentData;

  try {
    currentData = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error parsing JSON from ${absolutePath}: ${error}`);
    currentData = {};
  }

  // Merge the existing data with the new data
  const updatedData = { ...currentData, ...newData };

  // Write the updated data back to the file
  const jsonData = JSON.stringify(updatedData, null, 2);
  fs.writeFileSync(absolutePath, jsonData, 'utf-8');
}

export function deleteRecord(key: string): void {
  const filePath = path.join(process.cwd(), 'public', 'metadata.json');
  const absolutePath = path.resolve(filePath);

  // Read the existing file
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const currentData = JSON.parse(fileContent);

  // Delete the specified key
  delete currentData[key];

  const jsonData = JSON.stringify(currentData, null, 2);
  fs.writeFileSync(absolutePath, jsonData, 'utf-8');
}
