import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  ParseIntPipe,
  Param,
  Query,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { Doc } from 'src/doc/model/doc.entity';
import { UpdateGuessDto } from './dto/update-guess.dto';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async getCandiateDocs(
    @Query('count', ParseIntPipe) count: number,
  ): Promise<Doc[]> {
    const candiateDocs = await this.sessionService.getCandiateDocs(count);
    return candiateDocs;
  }

  @Post('/guess')
  updateGuess(@Body() updateGuess: UpdateGuessDto) {
    return this.sessionService.updateGuess(updateGuess);
  }
}
