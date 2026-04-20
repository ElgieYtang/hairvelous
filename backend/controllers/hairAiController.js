const hairAiService = require('../services/hairAiService');

class HairAiController {
  async analyze(req, res, next) {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 is required' });
      }

      const result = await hairAiService.analyzeHairFromImage(req.user.userId, imageBase64);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HairAiController();

