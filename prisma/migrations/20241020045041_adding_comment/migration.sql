-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "featuredImage" SET DEFAULT '/login-image.jpg';

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "profile" SET DEFAULT '/avatar-placeholder.png';

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "desc" TEXT NOT NULL,
    "postID" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
