import {
  Controller,
  Get,
  Query,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { LocationService } from "./location.service";
import { Logger } from "@aws-lambda-powertools/logger";

@Controller("location")
export class LocationController {
  private readonly logger = new Logger("LocationController");

  constructor(private readonly locationService: LocationService) {}

  @Get()
  async getLocation(
    @Query("lat") lat: string,
    @Query("lon") lon: string
  ): Promise<{ address: string }> {

    this.logger.debug("Received location request", { lat, lon });

    if (!lat || !lon) {
      throw new BadRequestException("lat and lon query parameters are required");
    }

    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
      throw new BadRequestException("lat and lon must be valid numbers");
    }

    if (parsedLat < -90 || parsedLat > 90) {
      throw new BadRequestException("lat must be between -90 and 90");
    }

    if (parsedLon < -180 || parsedLon > 180) {
      throw new BadRequestException("lon must be between -180 and 180");
    }

    try {
      const address = await this.locationService.getLocationForWeb(parsedLat, parsedLon);
      return { address };
    } catch (error) {
      this.logger.error("Failed to retrieve location", { error });
      throw new InternalServerErrorException("Failed to retrieve location");
    }
  }
}
