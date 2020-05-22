<?php

namespace App\Controller\Api;

use App\Entity\Tasks;
use App\Entity\Categories;
use App\Repository\TasksRepository;
use App\Repository\CategoriesRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

    /**
     * @Route("/api/tasks", name="api_tasks_")
     */
class TasksController extends AbstractController
{

    /**
    * @Route("/", name="browse", methods={"GET"})
    */
    public function loadTaskList(TasksRepository $tasksRepository, SerializerInterface $serializer)
    {
        

        $tasksList = $serializer->normalize($tasksRepository->findAll(), null, ['groups' => 'task']);

        return $this->json([
            'tasksList' => $tasksList,
        ]);
    }





    /**
     * @Route("/", name="add", methods={"POST"})
     */
    public function addTask(Request $request)
    {


        // Je récupère les données envoyées au format JSON dans la requête HTTP dans des variables
        $completion = 0;

        $task = new Tasks;
 

         // On décode les données envoyées
         $donnees = json_decode($request->getContent());
        // Je complète les valeurs des propriétés du model (correspondants aux colonne de la table ciblée par le model).
        $task->setTitle($donnees->title);
        $task->setCompletion(0);
        $task->setStatus(Tasks::STATUS_TODO);
        $task->setCategory(1);
        
        

        $em = $this->getDoctrine()->getManager();
            $em->persist($task);
            $em->flush();
            return new JsonResponse('ok', 200);
    }
}
