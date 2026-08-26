import { Trainer } from "../types/trainers";

const STORAGE_KEY = "trainers";

const initialTrainers: Trainer[] = [
  {
    id: 1,
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "9090242478",
    specialization: "Web Development",
    experience: 5,
    status: "Active",
  },
  {
    id: 2,
    firstName: "Priya",
    lastName: "Verma",
    email: "priya.verma@gmail.com",
    phone: "9874673290",
    specialization: "Data Science",
    experience: 7,
    status: "Active",
  },
  {
    id: 3,
    firstName: "Amit",
    lastName: "Singh",
    email: "amit.singh@gmail.com",
    phone: "9856783545",
    specialization: "Cloud Computing",
    experience: 4,
    status: "Inactive",
  },
];

const getStoredTrainers = (): Trainer[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedData =
    localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialTrainers)
    );

    return initialTrainers;
  }

  try {
    return JSON.parse(storedData);
  } catch {
    return [];
  }
};

const saveTrainers = (
  trainers: Trainer[]
) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(trainers)
  );
};

export const trainerService = {
  getAllTrainers(): Trainer[] {
    return getStoredTrainers();
  },

  getTrainerById(
    id: number
  ): Trainer | undefined {
    const trainers =
      getStoredTrainers();

    return trainers.find(
      (trainer) => trainer.id === id
    );
  },

  createTrainer(
    trainerData: Omit<Trainer, "id">
  ): Trainer {
    const trainers =
      getStoredTrainers();

    const emailExists =
      trainers.some(
        (trainer) =>
          trainer.email.toLowerCase() ===
          trainerData.email.toLowerCase()
      );

    if (emailExists) {
      throw new Error(
        "A trainer with this email already exists."
      );
    }


    const phoneExists =trainers.some((trainer) => trainer.phone === trainerData.phone);
    if (phoneExists) {throw new Error("A trainer with this phone number already exists.");}

    const newId =
      trainers.length > 0
        ? Math.max(
            ...trainers.map(
              (trainer) => trainer.id
            )
          ) + 1
        : 1;

    const newTrainer: Trainer = {
      id: newId,
      ...trainerData,
    };

    trainers.push(newTrainer);

    saveTrainers(trainers);

    return newTrainer;
  },

  updateTrainer(
    id: number,
    trainerData: Omit<Trainer, "id">
  ): Trainer {
    const trainers =
      getStoredTrainers();

    const trainerIndex =
      trainers.findIndex(
        (trainer) =>
          trainer.id === id
      );

    if (trainerIndex === -1) {
      throw new Error(
        "Trainer not found."
      );
    }

    const phoneExists =
  trainers.some(
    (trainer) =>
      trainer.id !== id &&
      trainer.phone ===
        trainerData.phone
  );

    if (phoneExists) {throw new Error("A trainer with this phone number already exists.");}

    const emailExists =
      trainers.some(
        (trainer) =>
          trainer.id !== id &&
          trainer.email.toLowerCase() ===
            trainerData.email.toLowerCase()
      );

    if (emailExists) {
      throw new Error(
        "A trainer with this email already exists."
      );
    }

    const updatedTrainer: Trainer = {
      id,
      ...trainerData,
    };

    trainers[trainerIndex] =
      updatedTrainer;

    saveTrainers(trainers);

    return updatedTrainer;
  },

  deleteTrainer(
    id: number
  ): void {
    const trainers =
      getStoredTrainers();

    const trainerExists =
      trainers.some(
        (trainer) =>
          trainer.id === id
      );

    if (!trainerExists) {
      throw new Error(
        "Trainer not found."
      );
    }

    const updatedTrainers =
      trainers.filter(
        (trainer) =>
          trainer.id !== id
      );

    saveTrainers(updatedTrainers);
  },
};