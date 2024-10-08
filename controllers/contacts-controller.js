const MarketingModel = require("../models/contact.model");
const path = require("path");
const fs = require("fs");

exports.fetchAndUploadContactsInDB = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "./contacts.json");

    const data = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(data).data;

    const promises = jsonData.map(async (item) => {
      const mobile = item.id;
      const currentMonth = "september";
      const currentYear = "2024";

      const contacts = item.data.contacts.map((contact) => ({
        firstName: contact.firstName === null ? "" : contact.firstName,
        lastName: contact.lastName === null ? "" : contact.lastName,
        phoneNumber: contact.phoneNumber,
      }));

      const newMarketingData = new MarketingModel({
        mobile: mobile,
        month: currentMonth,
        year: currentYear,
        contacts: contacts,
      });

      await newMarketingData.save();
    });

    await Promise.all(promises);

    return res.status(200).json({
      success: true,
      message: "Data fetched and uploaded successfully to MongoDB.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createOrUpdateMarketingData = async (req, res) => {
  try {
    const { mobile, contacts } = req.body;

    if (!mobile || !contacts || !Array.isArray(contacts)) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile and contacts are required, and contacts must be an array",
      });
    }

    const currentDate = new Date();
    const currentMonth = currentDate
      .toLocaleString("default", { month: "long" })
      .toLowerCase();
    const currentYear = currentDate.getFullYear().toString();

    const formattedContacts = contacts.map((contact) => ({
      firstName: contact.firstName === null ? "" : contact.firstName,
      lastName: contact.lastName === null ? "" : contact.lastName,
      phoneNumber: contact.phoneNumber,
    }));

    const existingEntry = await MarketingModel.findOne({ mobile });

    if (existingEntry) {
      existingEntry.contacts = formattedContacts;
      await existingEntry.save();

      return res.status(200).json({
        success: true,
        message: "Marketing data updated successfully",
        data: existingEntry,
      });
    }

    const newMarketingData = new MarketingModel({
      mobile: mobile,
      month: currentMonth,
      year: currentYear,
      contacts: formattedContacts,
    });

    await newMarketingData.save();

    return res.status(201).json({
      success: true,
      message: "Marketing data created successfully",
      data: newMarketingData,
    });
  } catch (error) {
    console.log("Error creating or updating marketing data:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fetchByMobileNumber = async (req, res) => {
  try {
    const { mobile } = req.query;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const data = await MarketingModel.findOne({ mobile });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No data found for this mobile number",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fetchByMonthsAndYear = async (req, res) => {
  try {
    const { month, year, page = 1, limit = 10 } = req.query;
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }
    const monthLowerCase = month.toLowerCase();
    console.log(
      `Querying with month: ${month}, year: ${year}, page: ${page}, limit: ${limit}`
    );

    const yearString = year.toString();

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const data = await MarketingModel.find({
      month: monthLowerCase,
      year: yearString,
    })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const totalCount = await MarketingModel.countDocuments({
      month: monthLowerCase,
      year: yearString,
    });

    if (!data.length) {
      return res.status(404).json({
        success: false,
        message: `No data found for month: ${month} and year: ${year}`,
      });
    }

    return res.status(200).json({
      success: true,
      totalItems: data.length,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      totalCount,
      data,
    });
  } catch (error) {
    console.log("Error fetching data by month and year:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fetchAllData = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const data = await MarketingModel.find()
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const totalCount = await MarketingModel.countDocuments();

    return res.status(200).json({
      success: true,
      totalItems: data.length,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      totalCount,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
