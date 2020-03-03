import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/auth/model/user.entity';
import { DocContentDto } from './dto/doc-content';
import { DocService } from './doc.service';

@Controller('doc')
export class DocController {
  constructor(private readonly docService: DocService) {}

  @Get('profile')
  @UseGuards(AuthGuard())
  profile(@GetUser() user: User) {
    return user;
  }

  @Post()
  createDoc(@Body() docContent: DocContentDto) {
    return this.docService.createDoc(docContent);
  }

  @Put('/:id')
  updateDoc(
    @Param('id', ParseIntPipe) id: number,
    @Body() docContent: DocContentDto,
  ) {
    return this.docService.updateDoc(id, docContent);
  }

  @Delete('/:id')
  deleteDoc(@Param('id', ParseIntPipe) id: number) {
    return this.docService.deleteDoc(id);
  }
}
