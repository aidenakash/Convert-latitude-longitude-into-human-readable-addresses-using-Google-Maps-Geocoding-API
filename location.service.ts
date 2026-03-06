import { Injectable } from "@nestjs/common";
import { Logger } from "@aws-lambda-powertools/logger";

@Injectable()
export class LocationService {

  async apikey(): Promise<string> {
    const logger = new Logger("Location Api key");

    const apikey = process.env.googleApiKey;

    if (!apikey) {
      logger.error("Google API key (googleApiKey) is not set in environment variables");
      throw new Error("Missing required environment variable: googleApiKey");
    }

    logger.debug("API key retrieved successfully", { apikey: "****" });
    return apikey;
  }

  async getLocationForWeb(lat: number, lon: number): Promise<string> {
    const logger = new Logger("Location Service");

    if (
      typeof lat !== "number" ||
      typeof lon !== "number" ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      throw new Error("Invalid coordinates provided");
    }

    const apiKey = await this.apikey();
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

    try {
      logger.debug("Fetching location for coordinates", { lat, lon });

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        logger.debug("Location fetched successfully", { address });
        return address;
      }

      logger.warn("No results found for coordinates", { lat, lon });
      return "Location not found";

    } catch (error) {
      logger.error("Error fetching location", { error, lat, lon });
      return "Error retrieving location";
    }
  }
}
