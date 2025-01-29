import { DataTypes, Op, Sequelize } from "sequelize";

class DatabaseService {
    public sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize("Leaderboard", "postgres", "P@ssw0rd", {
            host: "localhost", // TODO: Use environment variables.
            port: 5432,
            dialect: "postgres",
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
        } catch (error) {
            throw error;
        }
    }

    defineModels() {
        const Player = this.sequelize.define("Player", {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });

        const Workout = this.sequelize.define("Workout", {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            pushUps: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            playerId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: Player,
                    key: 'id'
                }
            }
        });

        Player.hasMany(Workout, {foreignKey: 'playerId'});
        Workout.belongsTo(Player, {foreignKey: 'playerId'});
    }

    async sync() {
        try {
            await this.sequelize.sync({alter: true});
        } catch (error) {
            throw error;
        }
    }

    async getLeaderboard(startTime: Date, endTime: Date) {
        return await this.sequelize.models.Player.findAll({
            attributes: {
                include: [
                    [Sequelize.fn("COALESCE", Sequelize.fn("SUM", Sequelize.col("Workouts.pushUps")), 0), "totalPushUps"]
                ]
            },
            include: {
                model: this.sequelize.models.Workout,
                attributes: [],
                required: false,
                where: {
                    date: {
                        [Op.between]: [startTime, endTime]
                    }
                }
            },
            group: ["Player.id"]
        });
    }

    async getPlayerById(id: string) {
        try {
            return await this.sequelize.models.Player.findByPk(id);
        } catch (error) {
            throw error;
        }
    }

    async getPlayerWorkouts(id: string) {
        try {
            return await this.sequelize.models.Workout.findAll({where: {playerId: id}});
        } catch (error) {
            throw error;
        }
    }

    async addPlayer(name: string) {
        try {
            return await this.sequelize.models.Player.create({name, totalPushUps: 0});
        } catch (error) {
            throw error;
        }
    }

    async removePlayer(id: string) {
        try {
            return await this.sequelize.models.Player.destroy({where: {id}});
        } catch (error) {
            throw error;
        }
    }

    async addWorkout(player: any, pushUps: number) {
        try {
            const workout = await this.sequelize.models.Workout.create({date: new Date(), pushUps, playerId: player.id});
            await player.save();
            return workout;
        } catch (error) {
            throw error;
        }
    }
}

export const databaseService = new DatabaseService();