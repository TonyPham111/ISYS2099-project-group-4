import fs from 'fs';
import path from 'path';

export async function fetchFilesFromDesktop() {
    try {
        // Define the path to your desktop (assuming you're using Mac/Linux)
        const desktopPath = path.join(process.env.HOME, 'Desktop');

        // File names on your desktop
        const files = [
            'image_1.jpeg',
            'image_2.jpeg',
            'document.pdf'
        ];

        // Initialize an array to store the file data
        const fileData = [];

        // Read each file and store its data as Buffer and its name
        for (const fileName of files) {
            const filePath = path.join(desktopPath, fileName);
            const fileBuffer = fs.readFileSync(filePath); // Synchronously read file as Buffer
            fileData.push({
                file_name: fileName,
                file: fileBuffer.toString('base64') // Convert Buffer to Base64
            });
        }

        // Return the array of file data
        return fileData;
    } catch (error) {
        console.error('Error fetching files:', error);
        throw new Error('Unable to fetch files from desktop');
    }
}