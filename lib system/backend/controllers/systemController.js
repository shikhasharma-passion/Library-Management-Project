const SystemConfig = require("../models/SystemConfig");

// Default initial values
const defaultStatus = {
  status: "OPEN",
  shift: "09:00 AM - 06:00 PM",
  librarian: "Dr. A.K. Sinha",
  footfall: 148,
  labActive: 18,
  readingOccupancy: 72
};

async function getSystemStatus(req, res) {
  try {
    let config = await SystemConfig.findOne({ key: "libraryStatus" });
    if (!config) {
      config = await SystemConfig.create({
        key: "libraryStatus",
        value: defaultStatus
      });
    }
    res.json(config.value);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateSystemStatus(req, res) {
  try {
    const { status, shift, librarian, footfall, labActive, readingOccupancy } = req.body;

    let config = await SystemConfig.findOne({ key: "libraryStatus" });
    if (!config) {
      config = new SystemConfig({ key: "libraryStatus" });
    }

    config.value = {
      status: status || "OPEN",
      shift: shift || "09:00 AM - 06:00 PM",
      librarian: librarian || "Dr. A.K. Sinha",
      footfall: Number(footfall !== undefined ? footfall : 148),
      labActive: Number(labActive !== undefined ? labActive : 18),
      readingOccupancy: Number(readingOccupancy !== undefined ? readingOccupancy : 72)
    };

    await config.save();
    res.json({ success: true, message: "Library monitor status updated successfully!", value: config.value });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getSystemStatus,
  updateSystemStatus
};
