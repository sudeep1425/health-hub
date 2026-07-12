const dietModel = require('../models/dietModel');
const waterModel = require('../models/waterModel');
const { Parser } = require('json2csv');

const reportsController = {
  async getReport(req, res, next) {
    try {
      const userId = req.params.userId;
      if (parseInt(userId) !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const days = parseInt(req.query.days) || 30;
      const [dietHistory, waterHistory] = await Promise.all([
        dietModel.getHistorical(userId, days),
        waterModel.getHistorical(userId, days),
      ]);
      return res.json({ dietHistory, waterHistory });
    } catch (err) {
      next(err);
    }
  },

  async exportCSV(req, res, next) {
    try {
      const userId = req.params.userId;
      if (parseInt(userId) !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const [dietLogs, waterLogs] = await Promise.all([
        dietModel.getByUser(userId),
        waterModel.getByUser(userId),
      ]);

      // Combine into one CSV
      const rows = [
        ...dietLogs.map((d) => ({
          type: 'food',
          date: d.log_date,
          name: d.food_name,
          calories: d.calories,
          meal_type: d.meal_type,
          quantity_ml: '',
        })),
        ...waterLogs.map((w) => ({
          type: 'water',
          date: w.log_date,
          name: 'Water',
          calories: '',
          meal_type: '',
          quantity_ml: w.quantity_ml,
        })),
      ];
      rows.sort((a, b) => new Date(b.date) - new Date(a.date));

      const fields = ['type', 'date', 'name', 'calories', 'meal_type', 'quantity_ml'];
      const parser = new Parser({ fields });
      const csv = parser.parse(rows);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="health-report.csv"');
      return res.send(csv);
    } catch (err) {
      // json2csv not installed — fallback to manual CSV
      try {
        const userId = req.params.userId;
        const [dietLogs, waterLogs] = await Promise.all([
          dietModel.getByUser(userId),
          waterModel.getByUser(userId),
        ]);
        let csv = 'type,date,name,calories,meal_type,quantity_ml\n';
        dietLogs.forEach((d) => {
          csv += `food,${d.log_date},${d.food_name},${d.calories},${d.meal_type},\n`;
        });
        waterLogs.forEach((w) => {
          csv += `water,${w.log_date},Water,,, ${w.quantity_ml}\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="health-report.csv"');
        return res.send(csv);
      } catch (e) {
        next(e);
      }
    }
  },
};

module.exports = reportsController;
