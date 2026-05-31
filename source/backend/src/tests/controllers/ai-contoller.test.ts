import { generateResponse } from '../../controllers/ai.controller';

describe('AI Controller', () => {
    it('should return 400 if prompt is missing', async () => {
        const req = { body: {} } as any;    
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;
        
        await generateResponse(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Prompt is required' });
    });
});