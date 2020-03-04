import {
  Injectable,
  Post,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doc } from './model/doc.entity';
import { Repository } from 'typeorm';
import { DocContentDto } from './dto/doc-content';
import * as sha256 from 'sha256';

const SLOT_STRING = '&&&&';

@Injectable()
export class DocService {
  constructor(
    @InjectRepository(Doc)
    private readonly docRepository: Repository<Doc>,
  ) {}

  async createDoc(docContent: DocContentDto) {
    const doc = this.getDocEntityFromDocContent(docContent);
    try {
      await this.docRepository.save(doc);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('doc duplicated');
      }
    }
    return doc;
  }

  async getDoc(id: number) {
    return await this.docRepository.findOne({ id });
  }

  async updateDoc(id: number, docContent: DocContentDto) {
    const saved_doc = await this.docRepository.findOne({ id });
    if (!saved_doc) throw new BadRequestException('no doc found');

    const doc = this.getDocEntityFromDocContent(docContent);
    doc.id = id;
    await this.docRepository.save(doc);

    return doc;
  }

  async deleteDoc(id: number) {
    await this.docRepository.delete({ id });
  }

  private getDocEntityFromDocContent(docContent: DocContentDto) {
    let slot_length = 0;
    let question = this.cleanUpText(docContent.question);
    let answer = this.cleanUpText(docContent.answer);

    do {
      const slot_pos = question.indexOf(SLOT_STRING);
      if (slot_pos === -1) break;

      ++slot_length;
      question = question.replace(SLOT_STRING, `_$${slot_length}_`);
    } while (true);

    // if (slot_length == 0)
    //   throw new BadRequestException(`no slot, slot is ${SLOT_STRING}`);

    let answer_length = answer.split(' ').length;

    if (slot_length > 0) {
      if (answer_length > 0) {
        if (slot_length !== answer_length)
          throw new BadRequestException('slots are not match with answer');
      }
    }

    const doc = new Doc();
    doc.question = question;
    doc.description = docContent.description;
    doc.answer = answer;
    doc.answerLength = answer_length;
    doc.questionHash = sha256(question);

    return doc;
  }

  private cleanUpText(question: string): string {
    question = question.trim();

    while (true) {
      const space_index = question.indexOf('  ');
      if (space_index === -1) break;

      question = question.replace('  ', ' ');
    }

    return question;
  }
}
