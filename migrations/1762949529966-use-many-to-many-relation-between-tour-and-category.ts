import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseManyToManyRelationBetweenTourAndCategory1762949529966
  implements MigrationInterface
{
  name = 'UseManyToManyRelationBetweenTourAndCategory1762949529966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tour" DROP CONSTRAINT "FK_f8ca29b2c218abd8aa1e0e1c4da"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour" DROP CONSTRAINT "FK_d305ffb20137507c3ac63e128e4"
        `);
    await queryRunner.query(`
            CREATE TABLE "tour_categories_category" (
                "tourId" uuid NOT NULL,
                "categoryId" uuid NOT NULL,
                CONSTRAINT "PK_94206b5d50cab4f57da768ff450" PRIMARY KEY ("tourId", "categoryId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_0e7feb624b3ef4310bad81cf83" ON "tour_categories_category" ("tourId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_0d4c094c0d41ae182b361e97bf" ON "tour_categories_category" ("categoryId")
        `);
    await queryRunner.query(`
            ALTER TABLE "tour" DROP COLUMN "categoryId"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD CONSTRAINT "FK_d305ffb20137507c3ac63e128e4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tour_categories_category"
            ADD CONSTRAINT "FK_0e7feb624b3ef4310bad81cf836" FOREIGN KEY ("tourId") REFERENCES "tour"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "tour_categories_category"
            ADD CONSTRAINT "FK_0d4c094c0d41ae182b361e97bf6" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tour_categories_category" DROP CONSTRAINT "FK_0d4c094c0d41ae182b361e97bf6"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour_categories_category" DROP CONSTRAINT "FK_0e7feb624b3ef4310bad81cf836"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour" DROP CONSTRAINT "FK_d305ffb20137507c3ac63e128e4"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD "categoryId" uuid
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_0d4c094c0d41ae182b361e97bf"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_0e7feb624b3ef4310bad81cf83"
        `);
    await queryRunner.query(`
            DROP TABLE "tour_categories_category"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD CONSTRAINT "FK_d305ffb20137507c3ac63e128e4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD CONSTRAINT "FK_f8ca29b2c218abd8aa1e0e1c4da" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
